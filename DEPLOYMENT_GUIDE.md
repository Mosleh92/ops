# دليل النشر - MallOS Enterprise

## نظرة عامة

هذا الدليل يوضح كيفية نشر نظام MallOS Enterprise في بيئات مختلفة، من التطوير المحلي إلى الإنتاج.

## المتطلبات الأساسية

### البرامج المطلوبة
- **Node.js**: الإصدار 18 أو أحدث
- **npm**: الإصدار 8 أو أحدث
- **PostgreSQL**: الإصدار 14 أو أحدث
- **Redis**: الإصدار 6 أو أحدث
- **Git**: للتحكم في الإصدارات

### المتطلبات الموصى بها
- **Docker**: للنشر السريع
- **PM2**: لإدارة العمليات في الإنتاج
- **Nginx**: كخادم وكيل عكسي

## التثبيت المحلي

### 1. إعداد البيئة المحلية

```bash
# استنساخ المشروع
git clone https://github.com/Mosleh92/ops.git
cd ops

# تثبيت التبعيات
npm install

# إعداد البيئة
cp env.example .env
```

### 2. تكوين قاعدة البيانات

```bash
# إنشاء قاعدة البيانات
createdb mallos_enterprise

# تشغيل الهجرات
npm run migrate

# إدخال البيانات الأولية
npm run seed
```

### 3. تشغيل النظام

```bash
# تشغيل Backend
npm run dev

# تشغيل Frontend (في terminal منفصل)
cd frontend
npm install
npm run dev
```

## النشر باستخدام Docker

### 1. إعداد Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/mallos
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:14
    environment:
      - POSTGRES_DB=mallos
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. بناء وتشغيل

```bash
# بناء الصور
docker-compose build

# تشغيل الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

## النشر في الإنتاج

### 1. إعداد الخادم

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# تثبيت PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# تثبيت Redis
sudo apt install redis-server -y

# تثبيت PM2
sudo npm install -g pm2
```

### 2. إعداد قاعدة البيانات

```bash
# إنشاء مستخدم قاعدة البيانات
sudo -u postgres createuser mallos_user
sudo -u postgres createdb mallos_production
sudo -u postgres psql -c "ALTER USER mallos_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mallos_production TO mallos_user;"
```

### 3. نشر التطبيق

```bash
# استنساخ المشروع
git clone https://github.com/Mosleh92/ops.git
cd ops

# تثبيت التبعيات
npm install

# بناء التطبيق
npm run build

# إعداد البيئة
cp env.example .env
# تعديل ملف .env

# تشغيل الهجرات
npm run migrate

# تشغيل التطبيق باستخدام PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 4. إعداد Nginx

```nginx
# /etc/nginx/sites-available/mallos
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /static/ {
        alias /path/to/ops/frontend/dist/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/mallos /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## النشر في السحابة

### AWS Deployment

#### 1. إعداد EC2

```bash
# إنشاء مفتاح SSH
aws ec2 create-key-pair --key-name mallos-key --query 'KeyMaterial' --output text > mallos-key.pem
chmod 400 mallos-key.pem

# إنشاء مجموعة أمان
aws ec2 create-security-group --group-name mallos-sg --description "MallOS Security Group"

# إضافة قواعد الأمان
aws ec2 authorize-security-group-ingress --group-name mallos-sg --protocol tcp --port 22 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name mallos-sg --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress --group-name mallos-sg --protocol tcp --port 443 --cidr 0.0.0.0/0
```

#### 2. إعداد RDS

```bash
# إنشاء قاعدة بيانات RDS
aws rds create-db-instance \
    --db-instance-identifier mallos-db \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username mallos_user \
    --master-user-password secure_password \
    --allocated-storage 20
```

#### 3. نشر التطبيق

```bash
# رفع الملفات
scp -i mallos-key.pem -r . ec2-user@your-ec2-ip:/home/ec2-user/mallos

# الاتصال بالخادم
ssh -i mallos-key.pem ec2-user@your-ec2-ip

# تثبيت وتشغيل التطبيق
cd mallos
npm install
npm run build
pm2 start ecosystem.config.js
```

### Google Cloud Platform

#### 1. إعداد Compute Engine

```bash
# إنشاء VM
gcloud compute instances create mallos-instance \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=debian-11 \
    --image-project=debian-cloud \
    --tags=http-server,https-server

# إعداد جدار الحماية
gcloud compute firewall-rules create allow-http \
    --allow tcp:80 \
    --target-tags=http-server \
    --description="Allow HTTP traffic"

gcloud compute firewall-rules create allow-https \
    --allow tcp:443 \
    --target-tags=https-server \
    --description="Allow HTTPS traffic"
```

#### 2. إعداد Cloud SQL

```bash
# إنشاء قاعدة بيانات Cloud SQL
gcloud sql instances create mallos-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1

# إنشاء قاعدة البيانات
gcloud sql databases create mallos_production --instance=mallos-db

# إنشاء المستخدم
gcloud sql users create mallos_user \
    --instance=mallos-db \
    --password=secure_password
```

### Azure Deployment

#### 1. إعداد App Service

```bash
# إنشاء خطة App Service
az appservice plan create \
    --name mallos-plan \
    --resource-group mallos-rg \
    --sku B1

# إنشاء تطبيق الويب
az webapp create \
    --name mallos-app \
    --resource-group mallos-rg \
    --plan mallos-plan \
    --runtime "NODE|18-lts"

# إعداد متغيرات البيئة
az webapp config appsettings set \
    --name mallos-app \
    --resource-group mallos-rg \
    --settings \
    NODE_ENV=production \
    DATABASE_URL="your-connection-string"
```

## مراقبة الأداء

### 1. إعداد PM2 Monitoring

```bash
# مراقبة العمليات
pm2 monit

# عرض السجلات
pm2 logs

# إعادة تشغيل التطبيق
pm2 restart all
```

### 2. إعداد Sentry للخطأ

```javascript
// في ملف التكوين
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: process.env.NODE_ENV,
});
```

### 3. إعداد Prometheus للقياسات

```javascript
// إضافة middleware للقياسات
import promClient from 'prom-client';

const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics({ timeout: 5000 });

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
});
```

## النسخ الاحتياطية

### 1. نسخ احتياطية لقاعدة البيانات

```bash
# إنشاء نسخة احتياطية
pg_dump -h localhost -U mallos_user mallos_production > backup_$(date +%Y%m%d_%H%M%S).sql

# استعادة نسخة احتياطية
psql -h localhost -U mallos_user mallos_production < backup_file.sql
```

### 2. أتمتة النسخ الاحتياطية

```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="mallos_production"

# إنشاء نسخة احتياطية
pg_dump -h localhost -U mallos_user $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# حذف النسخ الاحتياطية القديمة (أكثر من 7 أيام)
find $BACKUP_DIR -name "backup_*.sql" -mtime +7 -delete
```

```bash
# إضافة إلى cron
crontab -e
# إضافة السطر التالي
0 2 * * * /path/to/backup.sh
```

## الأمان

### 1. إعداد SSL

```bash
# تثبيت Certbot
sudo apt install certbot python3-certbot-nginx

# الحصول على شهادة SSL
sudo certbot --nginx -d your-domain.com

# تجديد تلقائي
sudo crontab -e
# إضافة السطر التالي
0 12 * * * /usr/bin/certbot renew --quiet
```

### 2. إعداد جدار الحماية

```bash
# تثبيت UFW
sudo apt install ufw

# إعداد القواعد
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# تفعيل جدار الحماية
sudo ufw enable
```

### 3. تحديث النظام

```bash
# إعداد التحديثات التلقائية
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

## استكشاف الأخطاء

### 1. فحص السجلات

```bash
# سجلات التطبيق
pm2 logs

# سجلات Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# سجلات النظام
sudo journalctl -u nginx
sudo journalctl -u postgresql
```

### 2. فحص الأداء

```bash
# فحص استخدام الذاكرة
free -h

# فحص استخدام القرص
df -h

# فحص العمليات
htop
```

### 3. إعادة تشغيل الخدمات

```bash
# إعادة تشغيل التطبيق
pm2 restart all

# إعادة تشغيل Nginx
sudo systemctl restart nginx

# إعادة تشغيل PostgreSQL
sudo systemctl restart postgresql

# إعادة تشغيل Redis
sudo systemctl restart redis
```

## التحديثات

### 1. تحديث التطبيق

```bash
# جلب التحديثات
git pull origin main

# تثبيت التبعيات الجديدة
npm install

# تشغيل الهجرات
npm run migrate

# إعادة بناء التطبيق
npm run build

# إعادة تشغيل التطبيق
pm2 restart all
```

### 2. التحديث بدون توقف

```bash
# إعداد التحديث التدريجي
pm2 start ecosystem.config.js --watch

# أو استخدام PM2 cluster mode
pm2 start ecosystem.config.js -i max
```

## الدعم

للمساعدة في النشر أو استكشاف الأخطاء:

- **البريد الإلكتروني**: support@mallos.com
- **التوثيق**: https://docs.mallos.com
- **المساعدة**: https://help.mallos.com
- **GitHub Issues**: https://github.com/Mosleh92/ops/issues

---

**ملاحظة**: تأكد من تحديث جميع كلمات المرور والرموز المذكورة في هذا الدليل قبل النشر في الإنتاج. 