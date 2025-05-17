# Sistema de Gestión de Programas de Referidos

Esta aplicación permite gestionar programas de referidos en plataformas de email marketing. Permite:
- Crear y gestionar clientes
- Configurar campañas de referidos por cliente
- Generar links personalizados para cada lead
- Definir recompensas por número de invitados
- Visualizar métricas y estadísticas por campaña

## Requisitos
- Python 3.8+
- Node.js 16+

## Instalación

1. Instalar dependencias del backend:
```bash
pip install -r requirements.txt
```

2. Instalar dependencias del frontend:
```bash
cd frontend
npm install
```

3. Iniciar el servidor de desarrollo:
```bash
python app.py
```

## Estructura del Proyecto
```
referral-system/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   └── models/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
│   └── public/
└── README.md
```
