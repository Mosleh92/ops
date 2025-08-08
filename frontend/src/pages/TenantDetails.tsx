import { tenantsApi } from '@/services/api'
import {
    AlertTriangle,
    ArrowLeft,
    Building2,
    Calendar,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    Shield,
    Star,
    Store,
    TrendingUp,
    User,
    XCircle
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'

export default function TenantDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState('overview')

  const { data: tenant, isLoading, error } = useQuery(
    ['tenant', id],
    () => tenantsApi.getTenant(id!),
    {
      enabled: !!id
    }
  )

  const approveMutation = useMutation(
    (id: string) => tenantsApi.approveTenant(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenant', id])
        toast.success('Tenant approved successfully')
      },
      onError: () => {
        toast.error('Failed to approve tenant')
      }
    }
  )

  const rejectMutation = useMutation(
    ({ id, reason }: { id: string; reason: string }) => tenantsApi.rejectTenant(id, reason),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tenant', id])
        toast.success('Tenant rejected successfully')
      },
      onError: () => {
        toast.error('Failed to reject tenant')
      }
    }
  )

  const handleApprove = () => {
    if (id) {
      approveMutation.mutate(id)
    }
  }

  const handleReject = () => {
    if (id) {
      const reason = prompt('Please provide a reason for rejection:')
      if (reason) {
        rejectMutation.mutate({ id, reason })
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-success-100 text-success-800', icon: CheckCircle },
      pending_approval: { color: 'bg-warning-100 text-warning-800', icon: Clock },
      rejected: { color: 'bg-danger-100 text-danger-800', icon: XCircle },
      suspended: { color: 'bg-gray-100 text-gray-800', icon: AlertTriangle },
      expired: { color: 'bg-orange-100 text-orange-800', icon: Calendar }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending_approval
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.replace('_', ' ').toUpperCase()}
      </span>
    )
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Store },
    { id: 'contact', name: 'Contact', icon: User },
    { id: 'business', name: 'Business', icon: FileText },
    { id: 'lease', name: 'Lease', icon: Calendar },
    { id: 'compliance', name: 'Compliance', icon: Shield },
    { id: 'performance', name: 'Performance', icon: TrendingUp }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !tenant) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load tenant details</p>
        <button
          onClick={() => navigate('/tenants')}
          className="btn btn-primary mt-4"
        >
          Back to Tenants
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tenants')}
            className="btn btn-secondary btn-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tenants
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{tenant.businessName}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Tenant Code: {tenant.tenantCode}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {tenant.status === 'pending_approval' && (
            <>
              <button
                onClick={handleApprove}
                disabled={approveMutation.isLoading}
                className="btn btn-success btn-sm"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isLoading}
                className="btn btn-danger btn-sm"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Reject
              </button>
            </>
          )}
          <button className="btn btn-primary btn-sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>
      </div>

      {/* Status and Quick Info */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Store className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <div className="mt-1">
                  {getStatusBadge(tenant.status)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Mall</p>
                <p className="text-sm text-gray-900">{tenant.mall?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Lease Status</p>
                <p className="text-sm text-gray-900">
                  {tenant.leaseDetails?.startDate ? 'Active' : 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Rating</p>
                <p className="text-sm text-gray-900">
                  {tenant.performance?.rating ? `${tenant.performance.rating}/5` : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="card">
        <div className="card-header">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              )
            })}
          </nav>
        </div>

        <div className="card-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Business Name</dt>
                      <dd className="text-sm text-gray-900">{tenant.businessName}</dd>
                    </div>
                    {tenant.tradingName && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Trading Name</dt>
                        <dd className="text-sm text-gray-900">{tenant.tradingName}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Type</dt>
                      <dd className="text-sm text-gray-900">{tenant.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="text-sm text-gray-900">{tenant.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{tenant.email}</dd>
                    </div>
                    {tenant.phoneNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Phone</dt>
                        <dd className="text-sm text-gray-900">{tenant.phoneNumber}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lease Information</h3>
                  <dl className="space-y-3">
                    {tenant.leaseDetails?.startDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(tenant.leaseDetails.startDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.endDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(tenant.leaseDetails.endDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.rentAmount && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Monthly Rent</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.rentAmount} {tenant.leaseDetails.rentCurrency}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.securityDeposit && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Security Deposit</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.securityDeposit} {tenant.leaseDetails.rentCurrency}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Person</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Name</dt>
                      <dd className="text-sm text-gray-900">{tenant.contactPerson?.name || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Position</dt>
                      <dd className="text-sm text-gray-900">{tenant.contactPerson?.position || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Email</dt>
                      <dd className="text-sm text-gray-900">{tenant.contactPerson?.email || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Phone</dt>
                      <dd className="text-sm text-gray-900">{tenant.contactPerson?.phone || 'N/A'}</dd>
                    </div>
                    {tenant.contactPerson?.mobile && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Mobile</dt>
                        <dd className="text-sm text-gray-900">{tenant.contactPerson.mobile}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                  <dl className="space-y-3">
                    {tenant.address?.unitNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Unit Number</dt>
                        <dd className="text-sm text-gray-900">{tenant.address.unitNumber}</dd>
                      </div>
                    )}
                    {tenant.address?.floor && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Floor</dt>
                        <dd className="text-sm text-gray-900">{tenant.address.floor}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Street</dt>
                      <dd className="text-sm text-gray-900">{tenant.address?.street || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">City</dt>
                      <dd className="text-sm text-gray-900">{tenant.address?.city || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">State/Province</dt>
                      <dd className="text-sm text-gray-900">{tenant.address?.state || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Country</dt>
                      <dd className="text-sm text-gray-900">{tenant.address?.country || 'N/A'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Postal Code</dt>
                      <dd className="text-sm text-gray-900">{tenant.address?.postalCode || 'N/A'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Business Tab */}
          {activeTab === 'business' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Details</h3>
                  <dl className="space-y-3">
                    {tenant.businessDetails?.registrationNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Registration Number</dt>
                        <dd className="text-sm text-gray-900">{tenant.businessDetails.registrationNumber}</dd>
                      </div>
                    )}
                    {tenant.businessDetails?.taxId && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Tax ID</dt>
                        <dd className="text-sm text-gray-900">{tenant.businessDetails.taxId}</dd>
                      </div>
                    )}
                    {tenant.businessDetails?.licenseNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">License Number</dt>
                        <dd className="text-sm text-gray-900">{tenant.businessDetails.licenseNumber}</dd>
                      </div>
                    )}
                    {tenant.website && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                        <dd className="text-sm text-gray-900">
                          <a href={tenant.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-800">
                            {tenant.website}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Space Details</h3>
                  <dl className="space-y-3">
                    {tenant.spaceDetails?.area && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Area</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.spaceDetails.area} {tenant.spaceDetails.areaUnit}
                        </dd>
                      </div>
                    )}
                    {tenant.spaceDetails?.unitNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Unit Number</dt>
                        <dd className="text-sm text-gray-900">{tenant.spaceDetails.unitNumber}</dd>
                      </div>
                    )}
                    {tenant.spaceDetails?.floor && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Floor</dt>
                        <dd className="text-sm text-gray-900">{tenant.spaceDetails.floor}</dd>
                      </div>
                    )}
                    {tenant.spaceDetails?.parkingSpaces && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Parking Spaces</dt>
                        <dd className="text-sm text-gray-900">{tenant.spaceDetails.parkingSpaces}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Lease Tab */}
          {activeTab === 'lease' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Lease Terms</h3>
                  <dl className="space-y-3">
                    {tenant.leaseDetails?.leaseNumber && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Lease Number</dt>
                        <dd className="text-sm text-gray-900">{tenant.leaseDetails.leaseNumber}</dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.startDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Start Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(tenant.leaseDetails.startDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.endDate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">End Date</dt>
                        <dd className="text-sm text-gray-900">
                          {new Date(tenant.leaseDetails.endDate).toLocaleDateString()}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.renewalTerms && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Renewal Terms</dt>
                        <dd className="text-sm text-gray-900">{tenant.leaseDetails.renewalTerms}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Details</h3>
                  <dl className="space-y-3">
                    {tenant.leaseDetails?.rentAmount && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Monthly Rent</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.rentAmount} {tenant.leaseDetails.rentCurrency}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.securityDeposit && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Security Deposit</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.securityDeposit} {tenant.leaseDetails.rentCurrency}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.maintenanceFee && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Maintenance Fee</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.maintenanceFee} {tenant.leaseDetails.rentCurrency}
                        </dd>
                      </div>
                    )}
                    {tenant.leaseDetails?.utilitiesIncluded !== undefined && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Utilities Included</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.leaseDetails.utilitiesIncluded ? 'Yes' : 'No'}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Status</h3>
                  <dl className="space-y-3">
                    {tenant.compliance?.tradeLicense && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Trade License</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.compliance.tradeLicense.number} - {tenant.compliance.tradeLicense.status}
                        </dd>
                      </div>
                    )}
                    {tenant.compliance?.municipalityApproval && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Municipality Approval</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.compliance.municipalityApproval.number} - {tenant.compliance.municipalityApproval.status}
                        </dd>
                      </div>
                    )}
                    {tenant.compliance?.fireSafety && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fire Safety</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.compliance.fireSafety.certificate} - {tenant.compliance.fireSafety.status}
                        </dd>
                      </div>
                    )}
                    {tenant.compliance?.healthPermit && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Health Permit</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.compliance.healthPermit.number} - {tenant.compliance.healthPermit.status}
                        </dd>
                      </div>
                    )}
                    {tenant.compliance?.insurance && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Insurance</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.compliance.insurance.policyNumber} - {tenant.compliance.insurance.status}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance Overview</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">Overall Compliance</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        tenant.isCompliant ? 'bg-success-100 text-success-800' : 'bg-danger-100 text-danger-800'
                      }`}>
                        {tenant.isCompliant ? 'Compliant' : 'Non-Compliant'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Trade License</span>
                        <span className={`w-2 h-2 rounded-full ${
                          tenant.compliance?.tradeLicense?.status === 'valid' ? 'bg-success-500' : 'bg-danger-500'
                        }`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Municipality Approval</span>
                        <span className={`w-2 h-2 rounded-full ${
                          tenant.compliance?.municipalityApproval?.status === 'valid' ? 'bg-success-500' : 'bg-danger-500'
                        }`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Fire Safety</span>
                        <span className={`w-2 h-2 rounded-full ${
                          tenant.compliance?.fireSafety?.status === 'valid' ? 'bg-success-500' : 'bg-danger-500'
                        }`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Health Permit</span>
                        <span className={`w-2 h-2 rounded-full ${
                          tenant.compliance?.healthPermit?.status === 'valid' ? 'bg-success-500' : 'bg-danger-500'
                        }`}></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Insurance</span>
                        <span className={`w-2 h-2 rounded-full ${
                          tenant.compliance?.insurance?.status === 'valid' ? 'bg-success-500' : 'bg-danger-500'
                        }`}></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Metrics</h3>
                  <dl className="space-y-3">
                    {tenant.performance?.averageTransaction && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Average Transaction</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.performance.averageTransaction} {tenant.leaseDetails?.rentCurrency || 'AED'}
                        </dd>
                      </div>
                    )}
                    {tenant.performance?.conversionRate && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Conversion Rate</dt>
                        <dd className="text-sm text-gray-900">
                          {(tenant.performance.conversionRate * 100).toFixed(1)}%
                        </dd>
                      </div>
                    )}
                    {tenant.performance?.customerSatisfaction && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Customer Satisfaction</dt>
                        <dd className="text-sm text-gray-900">
                          {(tenant.performance.customerSatisfaction * 100).toFixed(1)}%
                        </dd>
                      </div>
                    )}
                    {tenant.performance?.rating && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Rating</dt>
                        <dd className="text-sm text-gray-900">
                          {tenant.performance.rating}/5 ({tenant.performance.reviews || 0} reviews)
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Performance</h3>
                  <div className="space-y-4">
                    {tenant.performance?.monthlySales && tenant.performance.monthlySales.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Sales Trend</h4>
                        <div className="space-y-2">
                          {tenant.performance.monthlySales.slice(-6).map((sale, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Month {index + 1}</span>
                              <span className="text-sm text-gray-900">
                                {sale} {tenant.leaseDetails?.rentCurrency || 'AED'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tenant.performance?.footTraffic && tenant.performance.footTraffic.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Foot Traffic</h4>
                        <div className="space-y-2">
                          {tenant.performance.footTraffic.slice(-6).map((traffic, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Month {index + 1}</span>
                              <span className="text-sm text-gray-900">{traffic} visitors</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
