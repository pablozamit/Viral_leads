# Migraciones de la Base de Datos

Este directorio contiene las migraciones de la base de datos para el proyecto de sistema de referidos.

## Uso

1. Crear una nueva migración:
```bash
flask db migrate -m "descripción de la migración"
```

2. Aplicar las migraciones:
```bash
flask db upgrade
```

3. Revertir una migración:
```bash
flask db downgrade
```

## Estructura de las migraciones

Las migraciones se guardan en el formato `alembic_version.py` y contienen:
- `upgrade()`: Función que aplica los cambios
- `downgrade()`: Función que revierte los cambios

## Versiones

- 0.1.0: Creación inicial de la base de datos
- 0.2.0: Adición de campos para integración con plataformas de email
- 0.3.0: Adición de sistema de recompensas
