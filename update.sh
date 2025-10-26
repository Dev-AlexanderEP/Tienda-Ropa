#!/bin/bash

# Script para reiniciar el contenedor del Admin-Tienda
echo "🔄 Reiniciando contenedor Admin-Tienda..."

# Detener el contenedor actual
echo "⏹️  Deteniendo contenedor..."
docker compose -f docker-compose.dev.yml down

# Iniciar el contenedor nuevamente
echo "▶️  Iniciando contenedor..."
docker compose -f docker-compose.dev.yml up -d

# Mostrar el estado de los contenedores
echo "📊 Estado de los contenedores:"
docker compose -f docker-compose.dev.yml ps

echo "✅ Reinicio completado!"
echo "🌐 La aplicación debería estar disponible en: http://localhost:5174"