import Layout from '@/components/Layout'
import LoadingSpinner from '@/components/LoadingSpinner'
import { AuthProvider } from '@/contexts/AuthContext'
import { useAuth } from '@/hooks/useAuth'
import AIAnalyticsDashboard from '@/pages/AIAnalyticsDashboard'
import ComputerVisionDashboard from '@/pages/ComputerVisionDashboard'
import Dashboard from '@/pages/Dashboard'
import IoTDashboard from '@/pages/IoTDashboard'
import Login from '@/pages/Login'
import Malls from '@/pages/Malls'
import OPSDashboard from '@/pages/OPSDashboard'
import Register from '@/pages/Register'
import SuperAdminDashboard from '@/pages/SuperAdminDashboard'
import TenantDetails from '@/pages/TenantDetails'
import TenantRegistration from '@/pages/TenantRegistration'
import Tenants from '@/pages/Tenants'
import TenantStats from '@/pages/TenantStats'
import Users from '@/pages/Users'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'

const queryClient = new QueryClient()

function AppRoutes() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="super-admin" element={<SuperAdminDashboard />} />
        <Route path="ops" element={<OPSDashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="tenants/register" element={<TenantRegistration />} />
        <Route path="tenants/:id" element={<TenantDetails />} />
        <Route path="tenants/stats" element={<TenantStats />} />
        <Route path="users" element={<Users />} />
        <Route path="malls" element={<Malls />} />
        <Route path="iot" element={<IoTDashboard />} />
        <Route path="ai" element={<AIAnalyticsDashboard />} />
        <Route path="computer-vision" element={<ComputerVisionDashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
