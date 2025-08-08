import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/services/api';
import {
    Activity,
    AlertTriangle,
    Bell,
    Building2,
    CheckCircle,
    Clock,
    Cpu,
    Database,
    Download,
    Eye,
    EyeOff,
    Globe,
    HardDrive,
    Lock,
    Memory,
    Network,
    RefreshCw,
    Settings,
    Shield,
    Users
} from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalMalls: number;
  activeMalls: number;
  totalTenants: number;
  activeTenants: number;
  systemUptime: number;
  apiRequests: number;
  databaseConnections: number;
  activeSessions: number;
}

interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  blockedIPs: number;
  securityAlerts: number;
  lastSecurityScan: string;
  vulnerabilities: number;
}

interface PerformanceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkTraffic: number;
  responseTime: number;
  errorRate: number;
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error';
  redis: 'healthy' | 'warning' | 'error';
  elasticsearch: 'healthy' | 'warning' | 'error';
  iot: 'healthy' | 'warning' | 'error';
  ai: 'healthy' | 'warning' | 'error';
  computerVision: 'healthy' | 'warning' | 'error';
}

export default function SuperAdminDashboard() {
  const { user } = useAuth();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch system data
  const { data: systemStats, isLoading: statsLoading } = useQuery(
    ['system-stats', selectedTimeRange],
    () => dashboardApi.getSystemStats(selectedTimeRange),
    { refetchInterval: autoRefresh ? 30000 : false }
  );

  const { data: securityMetrics, isLoading: securityLoading } = useQuery(
    ['security-metrics', selectedTimeRange],
    () => dashboardApi.getSecurityMetrics(selectedTimeRange),
    { refetchInterval: autoRefresh ? 60000 : false }
  );

  const { data: performanceMetrics, isLoading: performanceLoading } = useQuery(
    ['performance-metrics', selectedTimeRange],
    () => dashboardApi.getPerformanceMetrics(selectedTimeRange),
    { refetchInterval: autoRefresh ? 15000 : false }
  );

  const { data: systemHealth, isLoading: healthLoading } = useQuery(
    'system-health',
    dashboardApi.getSystemHealth,
    { refetchInterval: autoRefresh ? 10000 : false }
  );

  const { data: recentActivities, isLoading: activitiesLoading } = useQuery(
    ['recent-activities', selectedTimeRange],
    () => dashboardApi.getRecentActivities(selectedTimeRange),
    { refetchInterval: autoRefresh ? 45000 : false }
  );

  if (statsLoading || securityLoading || performanceLoading || healthLoading || activitiesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = systemStats?.data || {};
  const security = securityMetrics?.data || {};
  const performance = performanceMetrics?.data || {};
  const health = systemHealth?.data || {};
  const activities = recentActivities?.data || [];

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم المدير العام</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة شاملة للنظام والمراقبة والأمان
          </p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button
            onClick={() => setShowSensitiveData(!showSensitiveData)}
            className="flex items-center px-3 py-2 text-sm bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            {showSensitiveData ? <EyeOff className="h-4 w-4 ml-2" /> : <Eye className="h-4 w-4 ml-2" />}
            {showSensitiveData ? 'إخفاء البيانات الحساسة' : 'عرض البيانات الحساسة'}
          </button>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-3 py-2 text-sm rounded-lg ${
              autoRefresh ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}
          >
            <RefreshCw className={`h-4 w-4 ml-2 ${autoRefresh ? 'animate-spin' : ''}`} />
            التحديث التلقائي
          </button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <span className="text-sm font-medium text-gray-700">الفترة الزمنية:</span>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="1h">آخر ساعة</option>
          <option value="24h">آخر 24 ساعة</option>
          <option value="7d">آخر 7 أيام</option>
          <option value="30d">آخر 30 يوم</option>
        </select>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">إجمالي المستخدمين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
                <p className="text-sm text-green-600">+{stats.activeUsers || 0} نشط</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المراكز التجارية</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMalls || 0}</p>
                <p className="text-sm text-green-600">+{stats.activeMalls || 0} نشط</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المستأجرين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTenants || 0}</p>
                <p className="text-sm text-green-600">+{stats.activeTenants || 0} نشط</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">وقت التشغيل</p>
                <p className="text-2xl font-bold text-gray-900">{stats.systemUptime || 0}%</p>
                <p className="text-sm text-green-600">مستقر</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* System Health */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">صحة النظام</h3>
            <p className="card-description">حالة الخدمات والأنظمة</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {Object.entries(health).map(([service, status]) => (
                <div key={service} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${getHealthColor(status)}`}>
                      {getHealthIcon(status)}
                    </div>
                    <span className="mr-3 text-sm font-medium text-gray-700 capitalize">
                      {service.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </div>
                  <span className={`text-sm font-medium ${getHealthColor(status)}`}>
                    {status === 'healthy' ? 'صحي' : status === 'warning' ? 'تحذير' : 'خطأ'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">مقاييس الأداء</h3>
            <p className="card-description">استخدام الموارد والأداء</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">استخدام المعالج</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${performance.cpuUsage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{performance.cpuUsage || 0}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Memory className="h-5 w-5 text-green-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">استخدام الذاكرة</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${performance.memoryUsage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{performance.memoryUsage || 0}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="h-5 w-5 text-purple-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">استخدام القرص</span>
                </div>
                <div className="flex items-center">
                  <div className="w-24 bg-gray-200 rounded-full h-2 ml-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${performance.diskUsage || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{performance.diskUsage || 0}%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Network className="h-5 w-5 text-orange-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">حركة الشبكة</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {showSensitiveData ? `${performance.networkTraffic || 0} MB/s` : '***'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security & Monitoring */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Security Metrics */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">مقاييس الأمان</h3>
            <p className="card-description">مراقبة الأمان والتهديدات</p>
          </div>
          <div className="card-content">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">{security.failedLogins || 0}</p>
                <p className="text-sm text-gray-600">محاولات دخول فاشلة</p>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <Shield className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">{security.suspiciousActivities || 0}</p>
                <p className="text-sm text-gray-600">أنشطة مشبوهة</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Lock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{security.blockedIPs || 0}</p>
                <p className="text-sm text-gray-600">عناصر IP محظورة</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Bell className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{security.securityAlerts || 0}</p>
                <p className="text-sm text-gray-600">تنبيهات أمنية</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                آخر فحص أمني: {security.lastSecurityScan || 'غير متوفر'}
              </p>
              <p className="text-sm text-gray-600">
                الثغرات المكتشفة: {security.vulnerabilities || 0}
              </p>
            </div>
          </div>
        </div>

        {/* System Monitoring */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">مراقبة النظام</h3>
            <p className="card-description">إحصائيات النظام والاتصالات</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Globe className="h-5 w-5 text-blue-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">طلبات API</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  {showSensitiveData ? `${stats.apiRequests || 0}/min` : '***'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <Database className="h-5 w-5 text-green-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">اتصالات قاعدة البيانات</span>
                </div>
                <span className="text-sm font-bold text-green-600">
                  {showSensitiveData ? stats.databaseConnections || 0 : '***'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-purple-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">الجلسات النشطة</span>
                </div>
                <span className="text-sm font-bold text-purple-600">
                  {showSensitiveData ? stats.activeSessions || 0 : '***'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-orange-600 ml-2" />
                  <span className="text-sm font-medium text-gray-700">وقت الاستجابة</span>
                </div>
                <span className="text-sm font-bold text-orange-600">
                  {performance.responseTime || 0}ms
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">الأنشطة الأخيرة</h3>
          <p className="card-description">آخر الأنشطة والعمليات في النظام</p>
        </div>
        <div className="card-content">
          <div className="space-y-3">
            {activities.slice(0, 10).map((activity: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'login' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'security' ? 'bg-red-100 text-red-600' :
                    activity.type === 'system' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {activity.type === 'login' ? <Users className="h-4 w-4" /> :
                     activity.type === 'security' ? <Shield className="h-4 w-4" /> :
                     activity.type === 'system' ? <Settings className="h-4 w-4" /> :
                     <Activity className="h-4 w-4" />}
                  </div>
                  <div className="mr-3">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {activity.status === 'success' ? 'نجح' :
                   activity.status === 'warning' ? 'تحذير' : 'فشل'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">إجراءات سريعة</h3>
          <p className="card-description">العمليات السريعة للمدير العام</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="h-8 w-8 text-blue-600 mb-2" />
              إضافة مستخدم
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <Building2 className="h-8 w-8 text-green-600 mb-2" />
              إضافة مركز تجاري
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              إعدادات النظام
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <Download className="h-8 w-8 text-orange-600 mb-2" />
              نسخة احتياطية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
