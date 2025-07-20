# Guía de Despliegue en Producción - Proyecto Armonía

## Introducción

Esta guía proporciona instrucciones detalladas para desplegar la aplicación Armonía en un entorno de producción. El proyecto está basado en Next.js 15+ con React 19+ y utiliza PostgreSQL como base de datos principal.

## Prerrequisitos del Sistema

### Servidor de Aplicación
- **Sistema Operativo**: Ubuntu 22.04 LTS o superior
- **Node.js**: Versión 20.x o superior
- **npm**: Versión 10.x o superior
- **Memoria RAM**: Mínimo 4GB, recomendado 8GB
- **Almacenamiento**: Mínimo 20GB de espacio libre
- **CPU**: Mínimo 2 cores, recomendado 4 cores

### Base de Datos
- **PostgreSQL**: Versión 17 o superior
- **Memoria RAM**: Mínimo 2GB dedicados
- **Almacenamiento**: Mínimo 50GB para datos
- **Conexiones concurrentes**: Configurado para al menos 100 conexiones

### Servicios Externos
- **AWS S3**: Para almacenamiento de archivos
- **Twilio**: Para servicios de comunicación
- **Dominio**: Dominio personalizado con certificado SSL

## Variables de Entorno de Producción

### Archivo .env.production
```bash
# Base de datos
DATABASE_URL="postgresql://usuario:password@host:5432/armonia_prod"

# Aplicación
NODE_ENV="production"
NEXT_PUBLIC_API_URL="https://tu-dominio.com"
NEXTAUTH_SECRET="tu-secreto-super-seguro-de-32-caracteres"
NEXTAUTH_URL="https://tu-dominio.com"

# JWT
JWT_SECRET="tu-jwt-secret-super-seguro"

# AWS S3
AWS_ACCESS_KEY_ID="tu-access-key"
AWS_SECRET_ACCESS_KEY="tu-secret-key"
AWS_S3_BUCKET_NAME="armonia-prod-bucket"
AWS_S3_REGION="us-east-1"

# Twilio
TWILIO_ACCOUNT_SID="tu-twilio-sid"
TWILIO_AUTH_TOKEN="tu-twilio-token"
TWILIO_PHONE_NUMBER="tu-numero-twilio"

# Features
ENABLE_FREEMIUM=true
ENABLE_ANALYTICS=true
ENABLE_MONITORING=true

# WebAuthn
WEBAUTHN_RP_ID="tu-dominio.com"
```

## Proceso de Despliegue

### 1. Preparación del Servidor

#### Instalación de Node.js
```bash
# Actualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verificar instalación
node --version
npm --version
```

#### Instalación de PostgreSQL
```bash
# Instalar PostgreSQL 17
sudo apt install -y postgresql-17 postgresql-client-17

# Configurar usuario y base de datos
sudo -u postgres createuser --interactive armonia_user
sudo -u postgres createdb armonia_prod --owner=armonia_user
```

### 2. Configuración de la Aplicación

#### Clonar y Configurar el Proyecto
```bash
# Clonar repositorio
git clone https://github.com/CIDESOLUTIONS/app_armonia.git
cd app_armonia

# Instalar dependencias
npm install
cd armonia-backend && npm install && cd ..

# Configurar variables de entorno
cp .env.production .env
# Editar .env con los valores de producción
```

#### Generar Cliente de Prisma y Migrar Base de Datos
```bash
# Generar cliente de Prisma
cd armonia-backend
npx prisma generate

# Ejecutar migraciones (si existen)
npx prisma migrate deploy

# Poblar datos iniciales (si es necesario)
npx prisma db seed
```

### 3. Build de Producción

#### Compilar la Aplicación
```bash
# Volver al directorio raíz
cd ..

# Ejecutar build de producción
npm run build

# Verificar que se creó la carpeta .next
ls -la .next/
```

### 4. Configuración del Servidor Web

#### Usando PM2 (Recomendado)
```bash
# Instalar PM2 globalmente
sudo npm install -g pm2

# Crear archivo de configuración PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'armonia-app',
    script: 'npm',
    args: 'start',
    cwd: '/ruta/a/app_armonia',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

# Crear directorio de logs
mkdir -p logs

# Iniciar aplicación con PM2
pm2 start ecosystem.config.js

# Configurar PM2 para iniciar automáticamente
pm2 startup
pm2 save
```

#### Configuración de Nginx (Proxy Reverso)
```bash
# Instalar Nginx
sudo apt install -y nginx

# Crear configuración del sitio
sudo tee /etc/nginx/sites-available/armonia << EOF
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Redirigir HTTP a HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name tu-dominio.com www.tu-dominio.com;
    
    # Certificados SSL (configurar con Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/tu-dominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tu-dominio.com/privkey.pem;
    
    # Configuración SSL
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Proxy a la aplicación Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Configuración para archivos estáticos
    location /_next/static {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    
    # Configuración para Socket.IO
    location /socket.io/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Habilitar el sitio
sudo ln -s /etc/nginx/sites-available/armonia /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Configuración de SSL con Let's Encrypt
```bash
# Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com

# Configurar renovación automática
sudo crontab -e
# Añadir línea:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## Monitoreo y Mantenimiento

### Configuración de Logs
```bash
# Configurar rotación de logs
sudo tee /etc/logrotate.d/armonia << EOF
/ruta/a/app_armonia/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### Scripts de Monitoreo
```bash
# Crear script de health check
cat > health-check.sh << 'EOF'
#!/bin/bash
HEALTH_URL="https://tu-dominio.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $HEALTH_URL)

if [ $RESPONSE -eq 200 ]; then
    echo "$(date): Aplicación funcionando correctamente"
else
    echo "$(date): ERROR - Aplicación no responde (HTTP $RESPONSE)"
    # Reiniciar aplicación si es necesario
    pm2 restart armonia-app
fi
EOF

chmod +x health-check.sh

# Configurar cron para ejecutar cada 5 minutos
crontab -e
# Añadir línea:
# */5 * * * * /ruta/a/app_armonia/health-check.sh >> /var/log/armonia-health.log 2>&1
```

## Backup y Recuperación

### Backup de Base de Datos
```bash
# Crear script de backup
cat > backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/armonia"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="armonia_prod"

mkdir -p $BACKUP_DIR

# Backup de base de datos
pg_dump $DB_NAME > $BACKUP_DIR/armonia_db_$DATE.sql

# Comprimir backup
gzip $BACKUP_DIR/armonia_db_$DATE.sql

# Eliminar backups antiguos (mantener últimos 30 días)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completado: armonia_db_$DATE.sql.gz"
EOF

chmod +x backup-db.sh

# Configurar backup diario
crontab -e
# Añadir línea:
# 0 2 * * * /ruta/a/app_armonia/backup-db.sh
```

### Backup de Archivos
```bash
# Backup de archivos de aplicación
cat > backup-files.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/backups/armonia"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/ruta/a/app_armonia"

mkdir -p $BACKUP_DIR

# Backup de configuración y logs
tar -czf $BACKUP_DIR/armonia_files_$DATE.tar.gz \
    $APP_DIR/.env \
    $APP_DIR/logs/ \
    $APP_DIR/ecosystem.config.js

echo "Backup de archivos completado: armonia_files_$DATE.tar.gz"
EOF

chmod +x backup-files.sh
```

## Optimizaciones de Rendimiento

### Configuración de PostgreSQL
```sql
-- Optimizaciones para producción
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET maintenance_work_mem = '64MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
ALTER SYSTEM SET random_page_cost = 1.1;
ALTER SYSTEM SET effective_io_concurrency = 200;

-- Recargar configuración
SELECT pg_reload_conf();
```

### Configuración de Cache
```bash
# Instalar Redis para cache (opcional)
sudo apt install -y redis-server

# Configurar Redis
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

## Seguridad

### Configuración de Firewall
```bash
# Configurar UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Configuración de Fail2Ban
```bash
# Instalar Fail2Ban
sudo apt install -y fail2ban

# Configurar para Nginx
sudo tee /etc/fail2ban/jail.local << EOF
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6

[nginx-badbots]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
EOF

sudo systemctl restart fail2ban
```

## Comandos de Mantenimiento

### Comandos Útiles
```bash
# Ver estado de la aplicación
pm2 status

# Ver logs en tiempo real
pm2 logs armonia-app

# Reiniciar aplicación
pm2 restart armonia-app

# Recargar aplicación (sin downtime)
pm2 reload armonia-app

# Ver métricas de rendimiento
pm2 monit

# Verificar estado de Nginx
sudo systemctl status nginx

# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Ver logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Actualización de la Aplicación
```bash
# Script de actualización
cat > update-app.sh << 'EOF'
#!/bin/bash
echo "Iniciando actualización de Armonía..."

# Hacer backup antes de actualizar
./backup-db.sh
./backup-files.sh

# Detener aplicación
pm2 stop armonia-app

# Actualizar código
git pull origin main

# Instalar nuevas dependencias
npm install
cd armonia-backend && npm install && cd ..

# Generar cliente de Prisma
cd armonia-backend && npx prisma generate && cd ..

# Ejecutar migraciones si es necesario
cd armonia-backend && npx prisma migrate deploy && cd ..

# Compilar aplicación
npm run build

# Reiniciar aplicación
pm2 start armonia-app

echo "Actualización completada"
EOF

chmod +x update-app.sh
```

## Troubleshooting

### Problemas Comunes

#### Error de Conexión a Base de Datos
```bash
# Verificar estado de PostgreSQL
sudo systemctl status postgresql

# Verificar logs de PostgreSQL
sudo tail -f /var/log/postgresql/postgresql-17-main.log

# Verificar conexiones activas
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

#### Error de Memoria
```bash
# Verificar uso de memoria
free -h
pm2 monit

# Reiniciar aplicación si es necesario
pm2 restart armonia-app
```

#### Error de Permisos
```bash
# Verificar permisos de archivos
ls -la /ruta/a/app_armonia/

# Corregir permisos si es necesario
sudo chown -R ubuntu:ubuntu /ruta/a/app_armonia/
chmod -R 755 /ruta/a/app_armonia/
```

## Conclusión

Esta guía proporciona un marco completo para el despliegue de la aplicación Armonía en producción. Es importante seguir cada paso cuidadosamente y adaptar las configuraciones según las necesidades específicas del entorno de producción.

Para soporte adicional, consulte la documentación del proyecto o contacte al equipo de desarrollo.

---
*Guía actualizada el 20 de julio de 2025*

