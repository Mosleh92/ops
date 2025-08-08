import { useAuth } from '@/hooks/useAuth';
import { dashboardApi } from '@/services/api';
import {
    Activity,
    AlertTriangle,
    BarChart3,
    Bell,
    Check,
    Circle,
    Edit,
    Eye,
    FileText,
    MessageSquare,
    Plus,
    Search,
    Settings,
    Shield,
    Target,
    Trash2,
    Users,
    X
} from 'lucide-react';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

interface OPSStats {
  totalTenants: number;
  activeTenants: number;
  pendingWorkPermits: number;
  activeWorkPermits: number;
  pendingInspections: number;
  completedInspections: number;
  activeIncidents: number;
  resolvedIncidents: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  systemAlerts: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  type: 'inspection' | 'maintenance' | 'security' | 'cleaning' | 'emergency';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'overdue';
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  createdAt: string;
  tenantId?: string;
  mallId: string;
}

interface Incident {
  id: string;
  title: string;
  description: string;
  type: 'security' | 'maintenance' | 'safety' | 'emergency' | 'complaint';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'reported' | 'investigating' | 'resolving' | 'resolved' | 'closed';
  reportedBy: string;
  assignedTo: string;
  reportedAt: string;
  resolvedAt?: string;
  tenantId?: string;
  mallId: string;
}

interface WorkPermit {
  id: string;
  permitNumber: string;
  title: string;
  type: 'general' | 'hot_work' | 'high_level' | 'media' | 'special';
  status: 'pending_approval' | 'approved' | 'active' | 'completed' | 'rejected';
  tenantId: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  submittedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high';
  recipients: string[];
  sentAt: string;
  readBy: string[];
  status: 'draft' | 'sent' | 'delivered' | 'read';
}

export default function OPSDashboard() {
  const { user } = useAuth();
  const [selectedMall, setSelectedMall] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch OPS data
  const { data: opsStats, isLoading: statsLoading } = useQuery(
    ['ops-stats', selectedMall, selectedTimeRange],
    () => dashboardApi.getOPSStats(selectedMall, selectedTimeRange),
    { refetchInterval: 30000 }
  );

  const { data: tasks, isLoading: tasksLoading } = useQuery(
    ['ops-tasks', selectedMall, showCompleted],
    () => dashboardApi.getOPSTasks(selectedMall, showCompleted),
    { refetchInterval: 45000 }
  );

  const { data: incidents, isLoading: incidentsLoading } = useQuery(
    ['ops-incidents', selectedMall],
    () => dashboardApi.getOPSIncidents(selectedMall),
    { refetchInterval: 60000 }
  );

  const { data: workPermits, isLoading: permitsLoading } = useQuery(
    ['ops-work-permits', selectedMall],
    () => dashboardApi.getOPSWorkPermits(selectedMall),
    { refetchInterval: 90000 }
  );

  const { data: notifications, isLoading: notificationsLoading } = useQuery(
    ['ops-notifications', selectedMall],
    () => dashboardApi.getOPSNotifications(selectedMall),
    { refetchInterval: 120000 }
  );

  if (statsLoading || tasksLoading || incidentsLoading || permitsLoading || notificationsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const stats = opsStats?.data || {};
  const taskList = tasks?.data || [];
  const incidentList = incidents?.data || [];
  const permitList = workPermits?.data || [];
  const notificationList = notifications?.data || [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-blue-600 bg-blue-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'overdue': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'inspection': return <Eye className="h-4 w-4" />;
      case 'maintenance': return <Settings className="h-4 w-4" />;
      case 'security': return <Shield className="h-4 w-4" />;
      case 'cleaning': return <Activity className="h-4 w-4" />;
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      default: return <Circle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">لوحة تحكم العمليات</h1>
          <p className="mt-1 text-sm text-gray-500">
            إدارة شاملة لعمليات المركز التجاري والمهام والمراقبة
          </p>
        </div>
        <div className="flex items-center space-x-4 space-x-reverse">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="h-4 w-4 ml-2" />
            مهمة جديدة
          </button>
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            <MessageSquare className="h-4 w-4 ml-2" />
            إرسال إشعار
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 space-x-reverse">
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm font-medium text-gray-700">المركز التجاري:</span>
          <select
            value={selectedMall}
            onChange={(e) => setSelectedMall(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">جميع المراكز</option>
            <option value="mall1">المركز التجاري الأول</option>
            <option value="mall2">المركز التجاري الثاني</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 space-x-reverse">
          <span className="text-sm font-medium text-gray-700">الفترة:</span>
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
        <div className="flex items-center space-x-2 space-x-reverse">
          <input
            type="text"
            placeholder="بحث..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-64"
          />
          <Search className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المستأجرين النشطين</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeTenants || 0}</p>
                <p className="text-sm text-green-600">من أصل {stats.totalTenants || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">تصاريح العمل</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeWorkPermits || 0}</p>
                <p className="text-sm text-yellow-600">{stats.pendingWorkPermits || 0} في الانتظار</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">المهام النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks || 0}</p>
                <p className="text-sm text-red-600">{stats.overdueTasks || 0} متأخرة</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-500">الحوادث النشطة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeIncidents || 0}</p>
                <p className="text-sm text-green-600">{stats.resolvedIncidents || 0} محلولة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8 space-x-reverse">
          {[
            { id: 'overview', label: 'نظرة عامة', icon: BarChart3 },
            { id: 'tasks', label: 'المهام', icon: Target },
            { id: 'incidents', label: 'الحوادث', icon: AlertTriangle },
            { id: 'permits', label: 'التصاريح', icon: FileText },
            { id: 'notifications', label: 'الإشعارات', icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 ml-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recent Tasks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">المهام الأخيرة</h3>
              <p className="card-description">آخر المهام المطلوبة</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {taskList.slice(0, 5).map((task: Task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${getTypeIcon(task.type)}`}>
                        {getTypeIcon(task.type)}
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900">{task.title}</p>
                        <p className="text-xs text-gray-500">مخصصة لـ: {task.assignedTo}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority === 'urgent' ? 'عاجل' :
                         task.priority === 'high' ? 'عالي' :
                         task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                        {task.status === 'completed' ? 'مكتمل' :
                         task.status === 'in_progress' ? 'قيد التنفيذ' :
                         task.status === 'pending' ? 'في الانتظار' : 'متأخر'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Incidents */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">الحوادث الأخيرة</h3>
              <p className="card-description">آخر الحوادث المبلغ عنها</p>
            </div>
            <div className="card-content">
              <div className="space-y-3">
                {incidentList.slice(0, 5).map((incident: Incident) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${
                        incident.severity === 'critical' ? 'bg-red-100 text-red-600' :
                        incident.severity === 'high' ? 'bg-orange-100 text-orange-600' :
                        incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-green-100 text-green-600'
                      }`}>
                        <AlertTriangle className="h-4 w-4" />
                      </div>
                      <div className="mr-3">
                        <p className="text-sm font-medium text-gray-900">{incident.title}</p>
                        <p className="text-xs text-gray-500">بلغ عنها: {incident.reportedBy}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                      incident.status === 'resolving' ? 'bg-blue-100 text-blue-800' :
                      incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {incident.status === 'resolved' ? 'محلول' :
                       incident.status === 'resolving' ? 'قيد الحل' :
                       incident.status === 'investigating' ? 'قيد التحقيق' : 'مبلغ'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="card">
          <div className="card-header">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="card-title">إدارة المهام</h3>
                <p className="card-description">عرض وإدارة جميع المهام</p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCompleted}
                    onChange={(e) => setShowCompleted(e.target.checked)}
                    className="ml-2"
                  />
                  <span className="text-sm text-gray-600">عرض المكتملة</span>
                </label>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المهمة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الأولوية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مخصص لـ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ الاستحقاق
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {taskList.map((task: Task) => (
                    <tr key={task.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`p-1 rounded ${getTypeIcon(task.type)}`}>
                            {getTypeIcon(task.type)}
                          </div>
                          <span className="text-sm text-gray-900 mr-2">
                            {task.type === 'inspection' ? 'فحص' :
                             task.type === 'maintenance' ? 'صيانة' :
                             task.type === 'security' ? 'أمن' :
                             task.type === 'cleaning' ? 'تنظيف' : 'طوارئ'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority === 'urgent' ? 'عاجل' :
                           task.priority === 'high' ? 'عالي' :
                           task.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {task.status === 'completed' ? 'مكتمل' :
                           task.status === 'in_progress' ? 'قيد التنفيذ' :
                           task.status === 'pending' ? 'في الانتظار' : 'متأخر'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {task.assignedTo}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(task.dueDate).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'incidents' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">إدارة الحوادث</h3>
            <p className="card-description">عرض وإدارة جميع الحوادث والبلاغات</p>
          </div>
          <div className="card-content">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحادث
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الخطورة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      مبلغ عنه
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ البلاغ
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {incidentList.map((incident: Incident) => (
                    <tr key={incident.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{incident.title}</div>
                          <div className="text-sm text-gray-500">{incident.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {incident.type === 'security' ? 'أمن' :
                         incident.type === 'maintenance' ? 'صيانة' :
                         incident.type === 'safety' ? 'سلامة' :
                         incident.type === 'emergency' ? 'طوارئ' : 'شكوى'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.severity === 'critical' ? 'bg-red-100 text-red-800' :
                          incident.severity === 'high' ? 'bg-orange-100 text-orange-800' :
                          incident.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {incident.severity === 'critical' ? 'حرج' :
                           incident.severity === 'high' ? 'عالي' :
                           incident.severity === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          incident.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          incident.status === 'resolving' ? 'bg-blue-100 text-blue-800' :
                          incident.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {incident.status === 'resolved' ? 'محلول' :
                           incident.status === 'resolving' ? 'قيد الحل' :
                           incident.status === 'investigating' ? 'قيد التحقيق' : 'مبلغ'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {incident.reportedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(incident.reportedAt).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="text-orange-600 hover:text-orange-900">
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permits' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">إدارة التصاريح</h3>
            <p className="card-description">عرض وإدارة تصاريح العمل</p>
          </div>
          <div className="card-content">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      رقم التصريح
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      العنوان
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      النوع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الحالة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المستأجر
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      تاريخ البداية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      إجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {permitList.map((permit: WorkPermit) => (
                    <tr key={permit.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {permit.permitNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{permit.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permit.type === 'general' ? 'عام' :
                         permit.type === 'hot_work' ? 'عمل ساخن' :
                         permit.type === 'high_level' ? 'عمل مرتفع' :
                         permit.type === 'media' ? 'إعلامي' : 'خاص'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          permit.status === 'approved' ? 'bg-green-100 text-green-800' :
                          permit.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          permit.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                          permit.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {permit.status === 'approved' ? 'معتمد' :
                           permit.status === 'active' ? 'نشط' :
                           permit.status === 'pending_approval' ? 'في الانتظار' :
                           permit.status === 'completed' ? 'مكتمل' : 'مرفوض'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {permit.tenantName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(permit.startDate).toLocaleDateString('ar-SA')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Check className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">إدارة الإشعارات</h3>
            <p className="card-description">عرض وإدارة الإشعارات المرسلة</p>
          </div>
          <div className="card-content">
            <div className="space-y-4">
              {notificationList.map((notification: Notification) => (
                <div key={notification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'error' ? 'bg-red-100 text-red-600' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      notification.type === 'success' ? 'bg-green-100 text-green-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      <Bell className="h-4 w-4" />
                    </div>
                    <div className="mr-4">
                      <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400">
                        مرسل إلى: {notification.recipients.join(', ')} •
                        {new Date(notification.sentAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      notification.status === 'read' ? 'bg-green-100 text-green-800' :
                      notification.status === 'delivered' ? 'bg-blue-100 text-blue-800' :
                      notification.status === 'sent' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.status === 'read' ? 'مقروء' :
                       notification.status === 'delivered' ? 'مستلم' :
                       notification.status === 'sent' ? 'مرسل' : 'مسودة'}
                    </span>
                    <button className="text-blue-600 hover:text-blue-900">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">إجراءات سريعة</h3>
          <p className="card-description">العمليات السريعة لمدير العمليات</p>
        </div>
        <div className="card-content">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Target className="h-8 w-8 text-blue-600 mb-2" />
              مهمة جديدة
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
              إرسال إشعار
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <FileText className="h-8 w-8 text-purple-600 mb-2" />
              مراجعة تصاريح
            </button>
            <button className="flex flex-col items-center p-4 text-sm font-medium text-gray-900 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <AlertTriangle className="h-8 w-8 text-orange-600 mb-2" />
              تقرير حادث
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
