import hashlib
import random
import string
from datetime import datetime, timedelta
from typing import Dict, Optional
from flask import request
import redis
from config import config

# Inicializar Redis
redis_client = redis.from_url(config[os.getenv('FLASK_ENV', 'development')].REDIS_URL)

def generate_referral_code(length: int = 8) -> str:
    """Genera un código de referencia único."""
    characters = string.ascii_letters + string.digits
    while True:
        code = ''.join(random.choice(characters) for _ in range(length))
        # Verificar si el código ya existe en Redis
        if not redis_client.exists(f'referral_code:{code}'):
            redis_client.set(f'referral_code:{code}', '1', ex=3600)  # Expire en 1 hora
            return code

def verify_ip(ip_address: str, lead_id: int) -> bool:
    """Verifica si una IP es válida para evitar fraude."""
    # Obtener la IP del invitador
    referrer_ip = redis_client.get(f'lead_ip:{lead_id}')
    if referrer_ip and referrer_ip == ip_address:
        return False
    return True

def get_period_stats(referrals: list, period: str) -> int:
    """Obtiene estadísticas por período."""
    now = datetime.now()
    if period == 'daily':
        return len([r for r in referrals if r.created_at.date() == now.date()])
    elif period == 'weekly':
        return len([r for r in referrals if r.created_at.date() >= now.date() - timedelta(days=7)])
    elif period == 'monthly':
        return len([r for r in referrals if r.created_at.date() >= now.date() - timedelta(days=30)])
    elif period == 'yearly':
        return len([r for r in referrals if r.created_at.year == now.year])
    return 0

def validate_email(email: str) -> bool:
    """Valida el formato de un email."""
    if '@' not in email or '.' not in email:
        return False
    return True

def get_platform_api(platform: str) -> Optional[Dict]:
    """Obtiene las credenciales de la plataforma de email."""
    platforms = {
        'wildmail': os.getenv('WILDMAIL_API_KEY'),
        'activecampaign': os.getenv('ACTIVECAMPAIGN_API_KEY'),
        'systeme': os.getenv('SYSTEME_API_KEY')
    }
    return platforms.get(platform.lower())
