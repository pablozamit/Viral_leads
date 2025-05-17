import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Configuración general
    SECRET_KEY = os.getenv('SECRET_KEY', os.urandom(24))
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # Configuración de la base de datos
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///referral_system.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Configuración de Redis
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # Configuración de email
    MAIL_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('SMTP_PORT', 587))
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv('SMTP_USER')
    MAIL_PASSWORD = os.getenv('SMTP_PASSWORD')
    
    # Configuración de integraciones
    WILDMAIL_API_KEY = os.getenv('WILDMAIL_API_KEY')
    ACTIVECAMPAIGN_API_KEY = os.getenv('ACTIVECAMPAIGN_API_KEY')
    SYSTEME_API_KEY = os.getenv('SYSTEME_API_KEY')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_ECHO = True

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_ECHO = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig
}
