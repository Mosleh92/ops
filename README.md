# MallOS Enterprise - نظام إدارة المراكز التجارية المتقدم

## نظرة عامة

MallOS Enterprise هو نظام إدارة شامل للمراكز التجارية يجمع بين الذكاء الاصطناعي وإنترنت الأشياء (IoT) لتوفير حلول متكاملة لإدارة المراكز التجارية الحديثة.

## المميزات الرئيسية

### 🔐 نظام المصادقة المتقدم
- **تسجيل دخول متعدد الأدوار**: مدير عام، مدير العمليات، حارس الأمن
- **مصادقة ثنائية العوامل (2FA)**: حماية إضافية للمدير العام
- **QR Code Scanner**: تسجيل دخول سريع للحرس
- **وضع عدم الاتصال**: عمل مستمر حتى بدون إنترنت

### 🏢 إدارة المستأجرين والمراكز
- **إدارة المستأجرين**: ملفات شاملة، عقود الإيجار، المدفوعات
- **إدارة المراكز**: معلومات المراكز، الخرائط، الإحصائيات
- **نظام التصاريح**: تصاريح العمل العامة (GWP)
- **إدارة المستخدمين**: صلاحيات متعددة المستويات

### 🤖 الذكاء الاصطناعي والتحليلات
- **تحليلات ذكية**: تحليل حركة الزبائن، الإيرادات، الأداء
- **رؤية حاسوبية**: مراقبة الأمن، تحليل الصور، التعرف على الوجوه
- **تنبؤات ذكية**: توقع الإيرادات، تحليل الاتجاهات
- **تقارير تفاعلية**: لوحات تحكم ديناميكية

### 📡 إنترنت الأشياء (IoT)
- **أجهزة استشعار ذكية**: مراقبة درجة الحرارة، الرطوبة، الطاقة
- **أنظمة الأمان**: كاميرات ذكية، أجهزة إنذار
- **إدارة الطاقة**: تحكم ذكي في الإضاءة والتهوية
- **مراقبة الصيانة**: تنبيهات تلقائية للأعطال

### 💳 نظام المدفوعات
- **مدفوعات متعددة**: بطاقات ائتمان، محافظ إلكترونية، تحويلات بنكية
- **فواتير تلقائية**: إنشاء وإرسال فواتير تلقائية
- **تقارير مالية**: تحليلات مفصلة للإيرادات والمصروفات
- **تكامل مع Stripe**: معالجة آمنة للمدفوعات

### 🔗 التكامل مع الأنظمة الخارجية
- **Salesforce**: إدارة علاقات العملاء
- **SAP**: إدارة الموارد المؤسسية
- **Oracle Financials**: الأنظمة المالية
- **Dynamics 365**: إدارة الأعمال
- **Stripe**: معالجة المدفوعات

## البنية التقنية

### Backend (Node.js + TypeScript)
```
src/
├── config/           # إعدادات النظام
├── database/         # قاعدة البيانات والهجرات
├── middleware/       # الوسائط البرمجية
├── models/          # نماذج البيانات
├── routes/          # مسارات API
├── services/        # خدمات الأعمال
└── utils/           # أدوات مساعدة
```

### Frontend (React + TypeScript)
```
frontend/src/
├── components/      # المكونات القابلة لإعادة الاستخدام
├── contexts/        # سياقات React
├── hooks/          # خطافات مخصصة
├── pages/          # صفحات التطبيق
├── services/       # خدمات API
└── types/          # تعريفات TypeScript
```

### قاعدة البيانات
- **PostgreSQL**: قاعدة البيانات الرئيسية
- **Redis**: التخزين المؤقت والجلسات
- **MongoDB**: تخزين البيانات غير المنظمة
- **Elasticsearch**: البحث والتحليلات

## التثبيت والإعداد

### المتطلبات الأساسية
- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Docker (اختياري)

### التثبيت السريع

1. **استنساخ المشروع**
```bash
git clone https://github.com/mallos-enterprise/mallos-platform.git
cd mallos-platform
```

2. **تثبيت التبعيات**
```bash
# Backend dependencies
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

3. **إعداد البيئة**
```bash
cp env.example .env
# تعديل ملف .env بالمعلومات المطلوبة
```

4. **إعداد قاعدة البيانات**
```bash
# تشغيل الهجرات
npm run migrate

# إدخال البيانات الأولية
npm run seed
```

5. **تشغيل النظام**
```bash
# تشغيل Backend
npm run dev

# تشغيل Frontend (في terminal منفصل)
cd frontend
npm run dev
```

### التثبيت باستخدام Docker

```bash
# بناء وتشغيل جميع الخدمات
docker-compose up -d

# عرض السجلات
docker-compose logs -f
```

## الأدوار والصلاحيات

### 👑 المدير العام (Super Admin)
- **الوصول الكامل**: جميع الميزات والإعدادات
- **إدارة المستأجرين**: إنشاء وإدارة المستأجرين الجدد
- **إعدادات النظام**: تكوين الميزات والسياسات
- **التقارير الشاملة**: جميع البيانات والإحصائيات

### 🏢 مدير العمليات (Mall Operations Manager)
- **لوحة التحكم الرئيسية**: نظرة شاملة على المركز التجاري
- **إدارة المستأجرين**: مراقبة العقود والمدفوعات
- **التصاريح**: مراجعة وإقرار تصاريح العمل
- **التواصل**: إرسال إشعارات وإعلانات

### 🛡️ حارس الأمن (Security Guard)
- **التطبيق المحمول**: واجهة مخصصة للأجهزة المحمولة
- **مسح QR Code**: تسجيل دخول سريع
- **قوائم الفحص**: فحوصات أمنية رقمية
- **التوثيق**: صور وملاحظات للانتهاكات

## واجهات المستخدم

### صفحات تسجيل الدخول
- **login-operations.html**: واجهة مدير العمليات
- **login-guard.html**: واجهة حارس الأمن (محمول)
- **login-superadmin.html**: واجهة المدير العام

### لوحات التحكم
- **لوحة التحكم الرئيسية**: نظرة عامة على النظام
- **لوحة إدارة المستأجرين**: إدارة المستأجرين والعقود
- **لوحة IoT**: مراقبة الأجهزة الذكية
- **لوحة الذكاء الاصطناعي**: التحليلات والتنبؤات

## API Documentation

### نقاط النهاية الرئيسية

#### المصادقة
```http
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

#### المستأجرين
```http
GET /api/tenants
POST /api/tenants
PUT /api/tenants/:id
DELETE /api/tenants/:id
```

#### المراكز التجارية
```http
GET /api/malls
POST /api/malls
PUT /api/malls/:id
GET /api/malls/:id/analytics
```

#### IoT
```http
GET /api/iot/devices
POST /api/iot/devices
GET /api/iot/sensor-data
POST /api/iot/commands
```

#### الذكاء الاصطناعي
```http
GET /api/ai/analytics
POST /api/ai/predictions
GET /api/ai/computer-vision
```

## الأمان

### حماية البيانات
- **تشفير البيانات**: تشفير جميع البيانات الحساسة
- **عزل المستأجرين**: فصل كامل لبيانات كل مستأجر
- **سجلات التدقيق**: تتبع جميع العمليات
- **نسخ احتياطية**: نسخ احتياطية تلقائية

### أمان التطبيق
- **JWT Tokens**: مصادقة آمنة
- **Rate Limiting**: حماية من الهجمات
- **CORS**: حماية من الطلبات غير المصرح بها
- **Helmet**: حماية رؤوس HTTP

## النشر والإنتاج

### إعدادات الإنتاج
```bash
# بناء التطبيق
npm run build

# تشغيل في وضع الإنتاج
npm start
```

### متغيرات البيئة المطلوبة
```env
# قاعدة البيانات
DATABASE_URL=postgresql://user:password@localhost:5432/mallos
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# خدمات خارجية
STRIPE_SECRET_KEY=sk_test_...
SALESFORCE_CLIENT_ID=...
SAP_BASE_URL=...

# إعدادات التطبيق
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://your-domain.com
```

## الدعم والصيانة

### السجلات والمراقبة
- **Winston**: سجلات مفصلة
- **Sentry**: مراقبة الأخطاء
- **Prometheus**: مقاييس الأداء
- **Grafana**: لوحات المراقبة

### النسخ الاحتياطية
- **نسخ احتياطية يومية**: قاعدة البيانات
- **نسخ احتياطية أسبوعية**: الملفات
- **استعادة سريعة**: إجراءات الاستعادة

## المساهمة

### إرشادات التطوير
1. Fork المشروع
2. إنشاء فرع للميزة الجديدة
3. Commit التغييرات
4. Push إلى الفرع
5. إنشاء Pull Request

### معايير الكود
- **TypeScript**: استخدام TypeScript لجميع الملفات
- **ESLint**: تنسيق الكود
- **Prettier**: تنسيق تلقائي
- **Jest**: اختبارات الوحدة

## الترخيص

هذا المشروع مرخص تحت رخصة MIT. راجع ملف [LICENSE](LICENSE) للتفاصيل.

## الدعم والاتصال

- **البريد الإلكتروني**: support@mallos.com
- **الموقع الإلكتروني**: https://mallos.com
- **التوثيق**: https://docs.mallos.com
- **المساعدة**: https://help.mallos.com

## الإصدارات

### الإصدار الحالي: 2.1.0
- تحسينات في الأداء
- ميزات أمان جديدة
- واجهات مستخدم محسنة
- دعم أفضل للأجهزة المحمولة

### الإصدارات السابقة
- **2.0.0**: إطلاق النسخة الرئيسية
- **1.5.0**: إضافة ميزات IoT
- **1.0.0**: الإصدار الأولي

---

## Render Deployment

A sample Render configuration is available in `render.yaml` to help deploy the platform:

- **mallos-backend**: Node service that builds and runs the API (`npm install && npm run build` then `npm start`).
- **mallos-frontend**: Static site built from the `frontend` directory.
- **mallos-db**: Managed PostgreSQL database.

Connect your repository in Render and it will detect this file to provision the services. Configure secrets like `JWT_SECRET` and `REDIS_URL` in the Render dashboard.

**MallOS Enterprise** - نظام إدارة المراكز التجارية المتقدم 🏢✨
