# 🚀 MallOS Enterprise - Quick Start Guide

## 📋 Prerequisites

- **Docker** (v20.10+) - [Download](https://www.docker.com/products/docker-desktop)
- **Docker Compose** (v2.0+) - Usually included with Docker Desktop
- **Git** - [Download](https://git-scm.com/)
- **Node.js** (v18+) - [Download](https://nodejs.org/) (for development)

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/mallos-enterprise/mallos-platform.git
cd mallos-platform
```

### 2. Start the System

#### Option A: Using Scripts (Recommended)
**Windows:**
```cmd
start.bat
```

**Linux/macOS:**
```bash
chmod +x start.sh
./start.sh
```

#### Option B: Manual Start
```bash
# Copy environment file
cp env.example .env

# Create directories
mkdir -p uploads logs ai-models monitoring/logs

# Start services
docker-compose up --build -d
```

### 3. Access the System

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:3003 | - |
| **Backend API** | http://localhost:3001 | - |
| **Grafana** | http://localhost:3000 | admin / admin |
| **pgAdmin** | http://localhost:5050 | admin@mallos.com / admin |
| **Redis Commander** | http://localhost:8081 | - |
| **RabbitMQ** | http://localhost:15672 | guest / guest |

### 4. Test Login Credentials

| Role | Username | Password | 2FA |
|------|----------|----------|-----|
| **Super Admin** | admin | admin123 | 123456 |
| **Operations** | operations@mallos.com | password123 | - |
| **Security Guard** | G001 | 1234 | - |

## 🛠️ Development Setup

### Backend Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

### Frontend Development
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run linting
npm run lint
```

## 📊 Monitoring & Logs

### View Service Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Access Monitoring Tools
- **Grafana**: http://localhost:3000 (admin/admin)
- **Prometheus**: http://localhost:9090
- **Service Health**: Check `docker-compose ps`

## 🛑 Stop the System

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete all data)
docker-compose down -v
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   netstat -ano | findstr :3001

   # Kill the process
   taskkill /PID <PID> /F
   ```

2. **Docker Not Running**
   - Start Docker Desktop
   - Ensure Docker service is running

3. **Permission Issues (Linux/macOS)**
   ```bash
   # Fix file permissions
   chmod +x start.sh
   sudo chown -R $USER:$USER .
   ```

4. **Database Connection Issues**
   ```bash
   # Restart database service
   docker-compose restart postgres

   # Check database logs
   docker-compose logs postgres
   ```

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v --remove-orphans

# Remove all images
docker system prune -a

# Start fresh
./start.sh
```

## 📚 Next Steps

1. **Configure Environment**: Edit `.env` file with your settings
2. **Add Data**: Use the seed scripts to populate with sample data
3. **Customize**: Modify the configuration files as needed
4. **Deploy**: Follow the deployment guide for production setup

## 🆘 Support

- **Documentation**: Check `README.md` and `DEPLOYMENT_GUIDE.md`
- **Issues**: Create an issue on GitHub
- **Email**: support@mallos.com

---

**🎉 You're all set! The MallOS Enterprise system is now running.**
