#!/bin/bash

# Script de Despliegue para Armonía Platform

# Configurar variables de entorno
export NODE_ENV=production
export NEXT_PUBLIC_APP_ENV=production

# Colores para la consola
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

# Función para mostrar mensajes de error
error_exit() {
    echo -e "${RED}ERROR: $1${NC}"
    exit 1
}

# Verificar requisitos
check_requirements() {
    echo "Verificando requisitos..."
    command -v node >/dev/null 2>&1 || error_exit "Node.js no está instalado"
    command -v npm >/dev/null 2>&1 || error_exit "npm no está instalado"
    command -v git >/dev/null 2>&1 || error_exit "git no está instalado"
}

# Preparar entorno
prepare_environment() {
    echo "Preparando entorno de producción..."
    npm ci || error_exit "Error instalando dependencias"
    npx prisma generate || error_exit "Error generando cliente Prisma"
}

# Construir aplicación
build_application() {
    echo "Construyendo aplicación..."
    npm run build || error_exit "Error construyendo la aplicación"
}

# Ejecutar migraciones
run_migrations() {
    echo "Ejecutando migraciones de base de datos..."
    npx prisma migrate deploy || error_exit "Error ejecutando migraciones"
}

# Iniciar aplicación
start_application() {
    echo "Iniciando aplicación..."
    npm run start || error_exit "Error iniciando la aplicación"
}

# Realizar backup
backup_database() {
    echo "Realizando backup de base de datos..."
    pg_dump $DATABASE_URL > backup_$(date +"%Y%m%d_%H%M%S").sql || error_exit "Error realizando backup"
}

# Limpieza
cleanup() {
    echo "Limpiando archivos temporales..."
    npm prune --production
}

# Monitoreo
send_deployment_notification() {
    # Enviar notificación a servicio de monitoreo
    curl -X POST https://monitoring.armonia.cloud/deploy \
         -H "Authorization: Bearer $MONITORING_TOKEN" \
         -d "version=$(git rev-parse HEAD)"
}

# Flujo principal de despliegue
main() {
    check_requirements
    backup_database
    prepare_environment
    build_application
    run_migrations
    cleanup
    start_application
    send_deployment_notification

    echo -e "${GREEN}Despliegue completado exitosamente!${NC}"
}

# Ejecutar flujo principal
main
