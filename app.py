from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin
from flask_cors import CORS
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from config import config
from utils import generate_referral_code, verify_ip, get_period_stats, validate_email, get_platform_api
import os

app = Flask(__name__)
CORS(app)

# Configuración para Vercel
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///referral_system.db')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-key')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Inicializar Redis
from utils import redis_client

# Modelos de la base de datos
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    is_admin = db.Column(db.Boolean, default=False)
    clients = db.relationship('Client', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Client(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    email_platform = db.Column(db.String(50), nullable=False)  # 'wildmail', 'activecampaign', 'systeme'
    platform_api_key = db.Column(db.String(255), nullable=False)
    campaigns = db.relationship('Campaign', backref='client', lazy=True)

class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey('client.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    rewards = db.relationship('Reward', backref='campaign', lazy=True)
    leads = db.relationship('Lead', backref='campaign', lazy=True)

class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    required_invites = db.Column(db.Integer, nullable=False)
    reward = db.Column(db.String(200), nullable=False)

class Lead(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False)
    invites = db.relationship('Invite', backref='lead', lazy=True)

class Invite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    lead_id = db.Column(db.Integer, db.ForeignKey('lead.id'), nullable=False)
    invitation_date = db.Column(db.DateTime, nullable=False)

@login_manager.user_loader
def load_user(id):
    return User.query.get(int(id))

# Rutas API
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user:
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(email=data['email'])
    user.set_password(data['password'])
    user.is_admin = data.get('is_admin', False)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(email=data['email']).first()
    if user and user.check_password(data['password']):
        return jsonify({'message': 'Login successful'}), 200
    return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/api/clients', methods=['GET', 'POST'])
def manage_clients():
    if request.method == 'POST':
        data = request.json
        client = Client(
            user_id=data['user_id'],
            name=data['name'],
            email=data['email'],
            email_platform=data['platform'],
            platform_api_key=data['api_key']
        )
        db.session.add(client)
        db.session.commit()
        return jsonify({'message': 'Client created successfully'}), 201
    
    clients = Client.query.all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'email': c.email,
        'platform': c.email_platform
    } for c in clients])

@app.route('/api/campaigns/<int:client_id>', methods=['GET', 'POST'])
def manage_campaigns(client_id):
    if request.method == 'POST':
        data = request.json
        campaign = Campaign(
            client_id=client_id,
            name=data['name'],
            start_date=datetime.fromisoformat(data['start_date']),
            end_date=datetime.fromisoformat(data['end_date']),
            rewards=data['rewards'],
        )
        db.session.add(campaign)
        db.session.commit()
        return jsonify({'message': 'Campaign created successfully'}), 201
    
    campaigns = Campaign.query.filter_by(client_id=client_id).all()
    return jsonify([{
        'id': c.id,
        'name': c.name,
        'start_date': c.start_date.isoformat(),
        'end_date': c.end_date.isoformat(),
        'rewards': c.rewards,
        'is_active': c.is_active
    } for c in campaigns])

@app.route('/api/leads/<int:campaign_id>', methods=['GET'])
def get_leads(campaign_id):
    leads = Lead.query.filter_by(campaign_id=campaign_id).all()
    return jsonify([{
        'id': l.id,
        'email': l.email,
        'referral_code': l.referral_code,
        'referral_count': len(l.referrals),
        'created_at': l.created_at.isoformat()
    } for l in leads])

@app.route('/api/referrals/<int:lead_id>', methods=['POST'])
def create_referral(lead_id):
    data = request.json
    lead = Lead.query.get_or_404(lead_id)
    referral = Referral(
        lead_id=lead_id,
        referred_email=data['email'],
        ip_address=data['ip_address']
    )
    db.session.add(referral)
    db.session.commit()
    return jsonify({'message': 'Referral created successfully'}), 201

@app.route('/api/stats/<int:campaign_id>', methods=['GET'])
def get_campaign_stats(campaign_id):
    campaign = Campaign.query.get_or_404(campaign_id)
    leads = Lead.query.filter_by(campaign_id=campaign_id).all()
    referrals = Referral.query.filter_by(lead_id=campaign_id).all()
    
    stats = {
        'total_leads': len(leads),
        'total_referrals': len(referrals),
        'referrals_by_period': {
            'daily': len([r for r in referrals if r.created_at.date() == datetime.now().date()]),
            'weekly': len([r for r in referrals if r.created_at.date() >= datetime.now().date() - timedelta(days=7)]),
            'monthly': len([r for r in referrals if r.created_at.date() >= datetime.now().date() - timedelta(days=30)]),
            'yearly': len([r for r in referrals if r.created_at.year == datetime.now().year])
        }
    }
    return jsonify(stats)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.getenv('PORT', 3000))
    app.run(host='0.0.0.0', port=port)
