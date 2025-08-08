#!/bin/bash

# =============================================================================
# MALLOS ENTERPRISE - STARTUP SCRIPT
# =============================================================================

set -e

echo "🚀 Starting MallOS Enterprise..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "✅ .env file created. Please update it with your configuration."
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p uploads
mkdir -p logs
mkdir -p ai-models
mkdir -p monitoring/logs

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service status
echo "🔍 Checking service status..."
docker-compose ps

echo "✅ MallOS Enterprise is starting up!"
echo ""
echo "🌐 Access URLs:"
echo "   - Frontend: http://localhost:3003"
echo "   - Backend API: http://localhost:3001"
echo "   - WebSocket: ws://localhost:3002"
echo "   - Grafana: http://localhost:3000 (admin/admin)"
echo "   - Prometheus: http://localhost:9090"
echo "   - Prometheus (HA): http://localhost:9091"
echo "   - Kibana: http://localhost:5601"
echo "   - pgAdmin: http://localhost:5050 (admin@mallos.com/admin)"
echo "   - Redis Commander: http://localhost:8081"
echo "   - RabbitMQ: http://localhost:15672 (guest/guest)"
echo ""
echo "📋 Test Credentials:"
echo "   - Super Admin: admin / admin123 / 123456"
echo "   - Operations: operations@mallos.com / password123"
echo "   - Security Guard: G001 / 1234"
echo ""
echo "🛑 To stop services: docker-compose down"
echo "📊 To view logs: docker-compose logs -f"
