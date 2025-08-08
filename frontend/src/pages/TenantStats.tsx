import { tenantsApi } from '@/services/api'
import {
    Building2,
    CheckCircle,
    Clock,
    Store,
    TrendingUp
} from 'lucide-react'
import { useQuery } from 'react-query'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function TenantStats() {
  const { data: stats, isLoading } = useQuery('tenantStats', () => tenantsApi.getTenantStats())

  const statusColors = {
    active: '#10B981',
    pending_approval: '#F59E0B',
    rejected: '#EF4444',
    suspended: '#6B7280',
    expired: '#F97316'
  }

  const typeColors = {
    retail: '#3B82F6',
    food_beverage: '#10B981',
    entertainment: '#8B5CF6',
    services: '#F59E0B',
    office: '#EF4444',
    warehouse: '#6B7280',
    parking: '#84CC16',
    other: '#9CA3AF'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const statusData = stats?.statusDistribution?.map((item: any) => ({
    name: item.status.replace('_', ' ').toUpperCase(),
    value: item.count,
    color: statusColors[item.status as keyof typeof statusColors] || '#9CA3AF'
  })) || []

  const typeData = stats?.typeDistribution?.map((item: any) => ({
    name: item.type.replace('_', ' ').toUpperCase(),
    value: item.count,
    color: typeColors[item.type as keyof typeof typeColors] || '#9CA3AF'
  })) || []

  const monthlyData = stats?.monthlyRegistrations?.map((item: any) => ({
    month: item.month,
    registrations: item.count
  })) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenant Statistics</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comprehensive overview of tenant management and performance
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Tenants</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalTenants || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-success-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Tenants</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.activeTenants || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-warning-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Approval</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.pendingApproval || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.thisMonthRegistrations || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Status Distribution</h3>
            <p className="text-sm text-gray-500">Breakdown of tenant statuses</p>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Type Distribution */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Business Type Distribution</h3>
            <p className="text-sm text-gray-500">Breakdown by business type</p>
          </div>
          <div className="card-content">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={typeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {typeData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Registrations Chart */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-gray-900">Monthly Registrations</h3>
          <p className="text-sm text-gray-500">Tenant registration trend over the last 12 months</p>
        </div>
        <div className="card-content">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="registrations" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Top Performing Malls */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Malls</h3>
            <p className="text-sm text-gray-500">Malls with highest tenant count</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {stats?.topMalls?.map((mall: any, index: number) => (
                <div key={mall.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Building2 className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{mall.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{mall.tenantCount} tenants</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-500">Latest tenant registrations</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              {stats?.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Store className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">{activity.businessName}</span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(activity.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Compliance Overview */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Overview</h3>
            <p className="text-sm text-gray-500">Tenant compliance status</p>
          </div>
          <div className="card-content">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Compliant Tenants</span>
                <span className="text-sm font-medium text-success-600">
                  {stats?.compliantTenants || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Non-Compliant</span>
                <span className="text-sm font-medium text-danger-600">
                  {stats?.nonCompliantTenants || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Expiring Soon</span>
                <span className="text-sm font-medium text-warning-600">
                  {stats?.expiringSoon || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-sm font-medium text-gray-900">
                  {stats?.averageRating ? `${stats.averageRating.toFixed(1)}/5` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
