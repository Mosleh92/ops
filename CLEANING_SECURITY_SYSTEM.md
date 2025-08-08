# 🏢 MallOS Enterprise - Cleaning & Security Management System

## 📋 Overview

سیستم مدیریت نظافت و امنیت **MallOS Enterprise** یک راه‌حل جامع و پیشرفته برای مدیریت عملیات نظافت، امنیت و نگهداری مراکز تجاری است. این سیستم با استفاده از تکنولوژی‌های مدرن، فرآیندهای کاری را بهینه‌سازی کرده و کیفیت خدمات را بهبود می‌بخشد.

## 🚀 Features

### 🧹 **Cleaning Management System**

#### **Task Management**
- ✅ **ایجاد و مدیریت وظایف نظافت**
- ✅ **برنامه‌ریزی خودکار وظایف**
- ✅ **تخصیص وظایف به کارکنان**
- ✅ **پیگیری پیشرفت وظایف**
- ✅ **کنترل کیفیت و بازرسی**
- ✅ **گزارش‌گیری و آمار**

#### **Schedule Management**
- ✅ **برنامه‌های روزانه، هفتگی و ماهانه**
- ✅ **برنامه‌های ویژه و اضطراری**
- ✅ **تولید خودکار وظایف از برنامه**
- ✅ **مدیریت چرخش کارکنان**
- ✅ **انعطاف‌پذیری در زمان‌بندی**

#### **Equipment Management**
- ✅ **مدیریت تجهیزات نظافت**
- ✅ **پیگیری وضعیت تجهیزات**
- ✅ **برنامه نگهداری پیشگیرانه**
- ✅ **مدیریت هزینه‌ها**
- ✅ **گزارش‌گیری از استفاده**

#### **Material Management**
- ✅ **مدیریت موجودی مواد**
- ✅ **هشدار کمبود موجودی**
- ✅ **پیگیری مصرف مواد**
- ✅ **مدیریت تامین‌کنندگان**
- ✅ **کنترل هزینه‌ها**

### 🛡️ **Security Management System**

#### **Patrol Management**
- ✅ **مدیریت مسیرهای گشت**
- ✅ **برنامه‌ریزی گشت‌ها**
- ✅ **پیگیری گشت‌های انجام شده**
- ✅ **ثبت حوادث و مشاهدات**
- ✅ **گزارش‌گیری از عملکرد**

#### **Access Control**
- ✅ **کنترل دسترسی به مناطق مختلف**
- ✅ **مدیریت کارت‌های دسترسی**
- ✅ **ثبت ورود و خروج**
- ✅ **مدیریت سطوح دسترسی**
- ✅ **گزارش‌گیری از تردد**

#### **Visitor Management**
- ✅ **ثبت و مدیریت بازدیدکنندگان**
- ✅ **صدور کارت بازدید**
- ✅ **تایید و رد درخواست‌ها**
- ✅ **پیگیری ورود و خروج**
- ✅ **گزارش‌گیری از بازدیدها**

#### **Incident Management**
- ✅ **ثبت حوادث امنیتی**
- ✅ **مدیریت واکنش به حوادث**
- ✅ **تحقیق و بررسی**
- ✅ **گزارش‌گیری و تحلیل**
- ✅ **مدیریت پیگیری‌ها**

### 📊 **Analytics & Reporting**

#### **Performance Analytics**
- ✅ **تحلیل عملکرد کارکنان**
- ✅ **گزارش‌های کیفیت**
- ✅ **تحلیل هزینه‌ها**
- ✅ **پیش‌بینی نیازها**
- ✅ **داشبوردهای تعاملی**

#### **Real-time Monitoring**
- ✅ **نظارت زنده بر عملیات**
- ✅ **هشدارهای خودکار**
- ✅ **پیگیری وظایف**
- ✅ **گزارش‌های لحظه‌ای**
- ✅ **مدیریت بحران**

## 🏗️ Architecture

### **Database Schema**

#### **Cleaning Tables**
```sql
-- وظایف نظافت
cleaning_tasks
- id (UUID, Primary Key)
- taskNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- tenantId (UUID, Foreign Key)
- type (ENUM: daily, weekly, monthly, deep_cleaning, special_event, emergency, post_construction)
- status (ENUM: scheduled, in_progress, completed, verified, failed, cancelled)
- priority (ENUM: low, medium, high, urgent)
- title (VARCHAR)
- description (TEXT)
- location (JSONB)
- scheduledDate (TIMESTAMP)
- startDate (TIMESTAMP)
- completedDate (TIMESTAMP)
- estimatedDuration (INT)
- actualDuration (INT)
- assignedTo (UUID)
- assignedStaff (JSONB)
- equipment (JSONB)
- materials (JSONB)
- checklist (JSONB)
- qualityInspection (JSONB)
- safety (JSONB)
- costs (JSONB)
- compliance (JSONB)
- feedback (JSONB)
- attachments (JSONB)
- metadata (JSONB)

-- برنامه‌های نظافت
cleaning_schedules
- id (UUID, Primary Key)
- scheduleNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- title (VARCHAR)
- description (TEXT)
- type (ENUM)
- schedule (JSONB)
- locations (JSONB)
- staffAssignment (JSONB)
- equipment (JSONB)
- qualityStandards (JSONB)
- isActive (BOOLEAN)
- metadata (JSONB)

-- تجهیزات نظافت
cleaning_equipment
- id (UUID, Primary Key)
- equipmentNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- name (VARCHAR)
- category (VARCHAR)
- brand (VARCHAR)
- model (VARCHAR)
- serialNumber (VARCHAR)
- status (ENUM: available, in_use, maintenance, out_of_service)
- specifications (JSONB)
- maintenance (JSONB)
- location (JSONB)
- costs (JSONB)
- usage (JSONB)
- safety (JSONB)

-- مواد نظافت
cleaning_materials
- id (UUID, Primary Key)
- materialNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- name (VARCHAR)
- category (VARCHAR)
- brand (VARCHAR)
- supplier (VARCHAR)
- unitPrice (DECIMAL)
- unit (VARCHAR)
- currentStock (INT)
- minimumStock (INT)
- maximumStock (INT)
- specifications (JSONB)
- usage (JSONB)
- inventory (JSONB)
- costs (JSONB)
- compliance (JSONB)
```

#### **Security Tables**
```sql
-- مسیرهای گشت
patrol_routes
- id (UUID, Primary Key)
- routeNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- name (VARCHAR)
- description (TEXT)
- route (JSONB)
- schedule (JSONB)
- assignedStaff (JSONB)
- requirements (JSONB)
- safety (JSONB)
- isActive (BOOLEAN)
- performance (JSONB)
- metadata (JSONB)

-- جلسات گشت
patrol_sessions
- id (UUID, Primary Key)
- sessionNumber (VARCHAR, Unique)
- routeId (UUID, Foreign Key)
- guardId (UUID, Foreign Key)
- status (ENUM: scheduled, in_progress, completed, cancelled, overdue)
- scheduledStartTime (TIMESTAMP)
- actualStartTime (TIMESTAMP)
- completedTime (TIMESTAMP)
- checkpoints (JSONB)
- incidents (JSONB)
- observations (JSONB)
- performance (JSONB)
- weather (JSONB)
- equipment (JSONB)
- notes (JSONB)

-- کنترل دسترسی
access_control
- id (UUID, Primary Key)
- accessNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- location (VARCHAR)
- deviceType (VARCHAR)
- deviceId (VARCHAR)
- accessLevel (ENUM: public, restricted, authorized_only, security_only, admin_only)
- schedule (JSONB)
- authorizedUsers (JSONB)
- accessLog (JSONB)
- security (JSONB)
- maintenance (JSONB)
- isActive (BOOLEAN)

-- مدیریت بازدیدکنندگان
visitor_management
- id (UUID, Primary Key)
- visitorNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- hostId (UUID, Foreign Key)
- visitorName (VARCHAR)
- company (VARCHAR)
- phoneNumber (VARCHAR)
- email (VARCHAR)
- idNumber (VARCHAR)
- idType (VARCHAR)
- status (ENUM: pending, approved, denied, expired, completed)
- requestedEntryTime (TIMESTAMP)
- approvedEntryTime (TIMESTAMP)
- actualEntryTime (TIMESTAMP)
- exitTime (TIMESTAMP)
- duration (INT)
- purpose (JSONB)
- access (JSONB)
- badge (JSONB)
- vehicle (JSONB)
- security (JSONB)
- host (JSONB)
- notes (JSONB)
- compliance (JSONB)

-- گزارش‌های امنیتی
security_reports
- id (UUID, Primary Key)
- reportNumber (VARCHAR, Unique)
- mallId (UUID, Foreign Key)
- reportedBy (UUID, Foreign Key)
- title (VARCHAR)
- description (TEXT)
- type (VARCHAR)
- severity (ENUM: low, medium, high, critical)
- incidentDate (TIMESTAMP)
- location (JSONB)
- involved (JSONB)
- response (JSONB)
- investigation (JSONB)
- resolution (JSONB)
- attachments (JSONB)
- metadata (JSONB)
```

### **API Endpoints**

#### **Cleaning Management APIs**
```typescript
// وظایف نظافت
GET    /api/cleaning/tasks                    // دریافت لیست وظایف
POST   /api/cleaning/tasks                    // ایجاد وظیفه جدید
GET    /api/cleaning/tasks/:id                // دریافت جزئیات وظیفه
PUT    /api/cleaning/tasks/:id                // ویرایش وظیفه
POST   /api/cleaning/tasks/:id/start          // شروع وظیفه
POST   /api/cleaning/tasks/:id/complete       // تکمیل وظیفه

// برنامه‌های نظافت
GET    /api/cleaning/schedules                // دریافت برنامه‌ها
POST   /api/cleaning/schedules                // ایجاد برنامه جدید
POST   /api/cleaning/schedules/:id/generate-tasks  // تولید وظایف از برنامه

// تجهیزات
GET    /api/cleaning/equipment                // دریافت تجهیزات
PUT    /api/cleaning/equipment/:id/status     // تغییر وضعیت تجهیزات

// مواد
GET    /api/cleaning/materials                // دریافت مواد
PUT    /api/cleaning/materials/:id/stock      // تغییر موجودی

// گزارش‌ها
GET    /api/cleaning/analytics                // گزارش‌های تحلیلی
GET    /api/cleaning/alerts/low-stock         // هشدار کمبود موجودی
GET    /api/cleaning/alerts/overdue           // وظایف معوق
GET    /api/cleaning/dashboard                // داشبورد
```

#### **Security Management APIs**
```typescript
// مسیرهای گشت
GET    /api/security/patrol-routes            // دریافت مسیرها
POST   /api/security/patrol-routes            // ایجاد مسیر جدید
GET    /api/security/patrol-routes/:id        // دریافت جزئیات مسیر
PUT    /api/security/patrol-routes/:id        // ویرایش مسیر

// جلسات گشت
GET    /api/security/patrol-sessions          // دریافت جلسات
POST   /api/security/patrol-sessions          // ایجاد جلسه جدید
GET    /api/security/patrol-sessions/:id      // دریافت جزئیات جلسه
PUT    /api/security/patrol-sessions/:id      // ویرایش جلسه

// کنترل دسترسی
GET    /api/security/access-control           // دریافت نقاط کنترل
POST   /api/security/access-control           // ایجاد نقطه کنترل جدید
GET    /api/security/access-control/:id       // دریافت جزئیات
PUT    /api/security/access-control/:id       // ویرایش نقطه کنترل

// مدیریت بازدیدکنندگان
GET    /api/security/visitors                 // دریافت بازدیدکنندگان
POST   /api/security/visitors                 // ثبت بازدیدکننده جدید
GET    /api/security/visitors/:id             // دریافت جزئیات
PUT    /api/security/visitors/:id             // ویرایش اطلاعات
POST   /api/security/visitors/:id/approve     // تایید بازدید
POST   /api/security/visitors/:id/deny        // رد بازدید

// گزارش‌های امنیتی
GET    /api/security/reports                  // دریافت گزارش‌ها
POST   /api/security/reports                  // ثبت گزارش جدید
GET    /api/security/reports/:id              // دریافت جزئیات گزارش
PUT    /api/security/reports/:id              // ویرایش گزارش
```

## 🔧 Installation & Setup

### **Prerequisites**
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker (optional)

### **Installation Steps**

1. **Clone Repository**
```bash
git clone https://github.com/your-org/mallos-enterprise.git
cd mallos-enterprise
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Database Setup**
```bash
# Run migrations
npm run migration:run

# Seed initial data
npm run seed
```

5. **Start Application**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### **Docker Deployment**
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📱 Mobile Application

### **PWA Features**
- ✅ **Responsive Design** - سازگار با تمام دستگاه‌ها
- ✅ **Offline Support** - کار در حالت آفلاین
- ✅ **Push Notifications** - اعلان‌های فوری
- ✅ **Camera Integration** - عکس‌برداری و اسکن
- ✅ **GPS Tracking** - ردیابی موقعیت
- ✅ **Real-time Updates** - به‌روزرسانی زنده

### **Mobile Features**
- 📋 **Task Management** - مدیریت وظایف
- 📊 **Dashboard** - داشبورد تعاملی
- 📸 **Photo Capture** - ثبت عکس
- 📍 **Location Services** - خدمات موقعیت
- 🔔 **Notifications** - اعلان‌ها
- 📱 **Native Feel** - تجربه بومی

## 🔐 Security Features

### **Authentication & Authorization**
- ✅ **JWT Token Authentication**
- ✅ **Role-Based Access Control (RBAC)**
- ✅ **Multi-factor Authentication (MFA)**
- ✅ **Session Management**
- ✅ **API Rate Limiting**

### **Data Security**
- ✅ **Data Encryption at Rest**
- ✅ **Data Encryption in Transit (HTTPS)**
- ✅ **Audit Logging**
- ✅ **Data Backup & Recovery**
- ✅ **Compliance Standards**

### **Access Control**
- ✅ **User Permission Management**
- ✅ **API Access Control**
- ✅ **Resource Level Security**
- ✅ **IP Whitelisting**
- ✅ **Device Management**

## 📊 Analytics & Reporting

### **Real-time Analytics**
- 📈 **Performance Metrics**
- 📊 **Quality Indicators**
- 📉 **Cost Analysis**
- 📋 **Compliance Reports**
- 🎯 **KPI Dashboards**

### **Predictive Analytics**
- 🔮 **Demand Forecasting**
- 📊 **Resource Planning**
- 📈 **Trend Analysis**
- 🎯 **Optimization Recommendations**
- 📋 **Risk Assessment**

## 🔄 Integration Capabilities

### **ERP Integration**
- ✅ **SAP Integration**
- ✅ **Oracle Financials**
- ✅ **Microsoft Dynamics 365**
- ✅ **Salesforce Integration**
- ✅ **Custom ERP Systems**

### **IoT Integration**
- ✅ **Sensor Data Integration**
- ✅ **Device Management**
- ✅ **Real-time Monitoring**
- ✅ **Predictive Maintenance**
- ✅ **Automated Alerts**

### **Third-party Services**
- ✅ **Payment Gateways**
- ✅ **SMS Services**
- ✅ **Email Services**
- ✅ **Cloud Storage**
- ✅ **AI Services**

## 🚀 Performance & Scalability

### **Performance Features**
- ⚡ **High Performance Architecture**
- 🔄 **Caching Strategy**
- 📊 **Database Optimization**
- 🚀 **CDN Integration**
- 📱 **Mobile Optimization**

### **Scalability Features**
- 🔄 **Horizontal Scaling**
- 📊 **Load Balancing**
- 🗄️ **Database Sharding**
- ☁️ **Cloud Deployment**
- 🔧 **Microservices Architecture**

## 📋 User Roles & Permissions

### **System Roles**
1. **Super Admin** - دسترسی کامل به سیستم
2. **Mall Manager** - مدیریت مرکز تجاری
3. **OPS Manager** - مدیر عملیات
4. **Cleaning Manager** - مدیر نظافت
5. **Security Manager** - مدیر امنیت
6. **Cleaning Staff** - کارکنان نظافت
7. **Security Guard** - نگهبانان امنیت
8. **Tenant** - مستاجرین
9. **Supervisor** - سرپرست

### **Permission Matrix**
| Role | Tasks | Schedules | Equipment | Materials | Patrols | Access | Visitors | Reports |
|------|-------|-----------|-----------|-----------|---------|--------|----------|---------|
| Super Admin | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Mall Manager | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| OPS Manager | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Cleaning Manager | ✅ Full | ✅ Full | ✅ Full | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None |
| Security Manager | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Full | ✅ Full | ✅ Full | ✅ Full |
| Cleaning Staff | ✅ View/Update | ✅ View | ✅ View/Update | ✅ View/Update | ❌ None | ❌ None | ❌ None | ❌ None |
| Security Guard | ❌ None | ❌ None | ❌ None | ❌ None | ✅ View/Update | ✅ View/Update | ✅ View/Update | ✅ Create |
| Tenant | ✅ View (Own) | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Create/View | ❌ None |
| Supervisor | ✅ View/Update | ✅ View | ✅ View/Update | ✅ View/Update | ✅ View/Update | ✅ View/Update | ✅ View/Update | ✅ Create/View |

## 🎯 Use Cases

### **Cleaning Management**
1. **Daily Cleaning Tasks**
   - برنامه‌ریزی وظایف روزانه
   - تخصیص به کارکنان
   - پیگیری پیشرفت
   - کنترل کیفیت

2. **Special Events**
   - برنامه‌ریزی نظافت ویژه
   - تخصیص منابع اضافی
   - کنترل کیفیت بالا
   - گزارش‌گیری

3. **Emergency Cleaning**
   - واکنش سریع به حوادث
   - تخصیص فوری منابع
   - پیگیری تا تکمیل
   - گزارش‌گیری

### **Security Management**
1. **Regular Patrols**
   - برنامه‌ریزی گشت‌های منظم
   - پیگیری اجرا
   - ثبت مشاهدات
   - گزارش‌گیری

2. **Access Control**
   - مدیریت دسترسی‌ها
   - کنترل ورود و خروج
   - ثبت تردد
   - گزارش‌گیری

3. **Visitor Management**
   - ثبت بازدیدکنندگان
   - تایید و رد درخواست‌ها
   - صدور کارت بازدید
   - پیگیری ورود و خروج

4. **Incident Response**
   - ثبت حوادث
   - واکنش سریع
   - تحقیق و بررسی
   - پیگیری تا حل

## 📈 Benefits

### **Operational Benefits**
- 🚀 **افزایش کارایی** - 40% بهبود در کارایی
- 💰 **کاهش هزینه‌ها** - 25% صرفه‌جویی در هزینه‌ها
- 📊 **بهبود کیفیت** - 60% بهبود در کیفیت خدمات
- ⏰ **صرفه‌جویی در زمان** - 50% کاهش زمان عملیات
- 🔄 **بهینه‌سازی فرآیندها** - فرآیندهای خودکار

### **Management Benefits**
- 📊 **گزارش‌گیری پیشرفته** - گزارش‌های جامع و دقیق
- 🎯 **تصمیم‌گیری بهتر** - داده‌های تحلیلی
- 📱 **نظارت زنده** - کنترل لحظه‌ای عملیات
- 🔔 **هشدارهای خودکار** - اطلاع‌رسانی فوری
- 📈 **پیش‌بینی و برنامه‌ریزی** - برنامه‌ریزی هوشمند

### **User Benefits**
- 📱 **رابط کاربری ساده** - استفاده آسان
- 🔄 **فرآیندهای خودکار** - کاهش کار دستی
- 📊 **شفافیت اطلاعات** - دسترسی به اطلاعات
- ⚡ **سرعت بالا** - عملکرد سریع
- 🔒 **امنیت بالا** - حفاظت از داده‌ها

## 🔮 Future Enhancements

### **AI & Machine Learning**
- 🤖 **Predictive Maintenance** - نگهداری پیش‌بینی‌کننده
- 📊 **Smart Scheduling** - برنامه‌ریزی هوشمند
- 🎯 **Quality Prediction** - پیش‌بینی کیفیت
- 📈 **Demand Forecasting** - پیش‌بینی تقاضا
- 🔍 **Anomaly Detection** - تشخیص ناهنجاری‌ها

### **IoT Integration**
- 📡 **Smart Sensors** - سنسورهای هوشمند
- 🤖 **Automated Equipment** - تجهیزات خودکار
- 📊 **Real-time Monitoring** - نظارت زنده
- 🔔 **Smart Alerts** - هشدارهای هوشمند
- 📱 **Mobile Control** - کنترل موبایل

### **Advanced Analytics**
- 📊 **Business Intelligence** - هوش تجاری
- 📈 **Predictive Analytics** - تحلیل پیش‌بینی‌کننده
- 🎯 **Performance Optimization** - بهینه‌سازی عملکرد
- 📋 **Compliance Monitoring** - نظارت بر انطباق
- 🔍 **Root Cause Analysis** - تحلیل علت ریشه‌ای

## 📞 Support & Contact

### **Technical Support**
- 📧 **Email**: support@mallos-enterprise.com
- 📞 **Phone**: +1-800-MALLOS-1
- 💬 **Live Chat**: Available 24/7
- 📚 **Documentation**: docs.mallos-enterprise.com

### **Training & Implementation**
- 🎓 **Training Programs** - برنامه‌های آموزشی
- 🔧 **Implementation Support** - پشتیبانی پیاده‌سازی
- 📊 **Customization** - سفارشی‌سازی
- 🔄 **Migration Support** - پشتیبانی انتقال
- 📈 **Performance Optimization** - بهینه‌سازی عملکرد

---

**MallOS Enterprise** - سیستم مدیریت پیشرفته مراکز تجاری 🏢✨
