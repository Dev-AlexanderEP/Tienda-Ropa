#!/bin/bash

echo "🔍 Obteniendo IP del backend..."

# Verificar si el contenedor app_backend está ejecutándose
if ! docker ps --format "{{.Names}}" | grep -q "app_backend"; then
    echo "❌ Error: El contenedor 'app_backend' no está ejecutándose."
    echo "   Por favor, ejecuta primero tu docker-compose del backend."
    exit 1
fi

# Obtener la IP del contenedor app_backend
BACKEND_IP=$(docker inspect app_backend -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' 2>/dev/null | head -n1)

if [ -z "$BACKEND_IP" ]; then
    echo "❌ Error: No se pudo obtener la IP del contenedor app_backend"
    exit 1
fi

echo "✅ IP del backend detectada: $BACKEND_IP"

# Exportar la variable de entorno
export BACKEND_IP=$BACKEND_IP

echo "🚀 Iniciando frontend con IP dinámica..."

# Ejecutar docker-compose con la variable de entorno
docker-compose -f docker-compose.dev.yml up -d

echo "🏁 Frontend detenido."