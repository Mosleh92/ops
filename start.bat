@echo off
chcp 65001 >nul

REM =============================================================================
REM MALLOS ENTERPRISE - STARTUP SCRIPT (WINDOWS)
REM =============================================================================

echo 🚀 Starting MallOS Enterprise...

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not installed. Please install Docker first.
    pause
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from template...
    copy env.example .env
    echo ✅ .env file created. Please update it with your configuration.
)

REM Create necessary directories
echo 📁 Creating necessary directories...
if not exist uploads mkdir uploads
if not exist logs mkdir logs
if not exist ai-models mkdir ai-models
if not exist monitoring\logs mkdir monitoring\logs

REM Build and start services
echo 🔨 Building and starting services...
docker-compose up --build -d

REM Wait for services to be ready
echo ⏳ Waiting for services to be ready...
timeout /t 30 /nobreak >nul

REM Check service status
echo 🔍 Checking service status...
docker-compose ps

echo.
echo ✅ MallOS Enterprise is starting up!
echo.
echo 🌐 Access URLs:
echo    - Frontend: http://localhost:3003
echo    - Backend API: http://localhost:3001
echo    - WebSocket: ws://localhost:3002
echo    - Grafana: http://localhost:3000 (admin/admin)
echo    - Prometheus: http://localhost:9090
echo    - pgAdmin: http://localhost:5050 (admin@mallos.com/admin)
echo    - Redis Commander: http://localhost:8081
echo    - RabbitMQ: http://localhost:15672 (guest/guest)
echo.
echo 📋 Test Credentials:
echo    - Super Admin: admin / admin123 / 123456
echo    - Operations: operations@mallos.com / password123
echo    - Security Guard: G001 / 1234
echo.
echo 🛑 To stop services: docker-compose down
echo 📊 To view logs: docker-compose logs -f
echo.
pause
