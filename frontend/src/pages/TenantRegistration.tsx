import { mallsApi, tenantsApi } from '@/services/api'
import {
    ArrowLeft,
    Calendar,
    FileText,
    Save,
    Store,
    User
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useMutation, useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'

interface TenantFormData {
  mallId: string
  businessName: string
  tradingName?: string
  type: string
  category: string
  email: string
  phoneNumber?: string
  faxNumber?: string
  website?: string
  contactPerson: {
    name: string
    position: string
    email: string
    phone: string
    mobile?: string
  }
  address: {
    unitNumber?: string
    floor?: string
    building?: string
    street: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  businessDetails: {
    registrationNumber?: string
    taxId?: string
    licenseNumber?: string
    businessHours?: {
      monday?: { open: string; close: string }
      tuesday?: { open: string; close: string }
      wednesday?: { open: string; close: string }
      thursday?: { open: string; close: string }
      friday?: { open: string; close: string }
      saturday?: { open: string; close: string }
      sunday?: { open: string; close: string }
    }
  }
  leaseDetails: {
    startDate?: string
    endDate?: string
    rentAmount?: number
    rentCurrency?: string
    securityDeposit?: number
    maintenanceFee?: number
  }
}

const tenantTypes = [
  { value: 'retail', label: 'Retail' },
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'services', label: 'Services' },
  { value: 'office', label: 'Office' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'parking', label: 'Parking' },
  { value: 'other', label: 'Other' }
]

const businessCategories = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'home_goods', label: 'Home Goods' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'sports', label: 'Sports' },
  { value: 'books', label: 'Books' },
  { value: 'jewelry', label: 'Jewelry' },
  { value: 'toys', label: 'Toys' },
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'fast_food', label: 'Fast Food' },
  { value: 'cinema', label: 'Cinema' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'banking', label: 'Banking' },
  { value: 'pharmacy', label: 'Pharmacy' },
  { value: 'telecom', label: 'Telecom' },
  { value: 'other', label: 'Other' }
]

const currencies = [
  { value: 'AED', label: 'UAE Dirham (AED)' },
  { value: 'USD', label: 'US Dollar (USD)' },
  { value: 'EUR', label: 'Euro (EUR)' },
  { value: 'SAR', label: 'Saudi Riyal (SAR)' },
  { value: 'KWD', label: 'Kuwaiti Dinar (KWD)' },
  { value: 'QAR', label: 'Qatari Riyal (QAR)' }
]

export default function TenantRegistration() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<TenantFormData>({
    mallId: '',
    businessName: '',
    tradingName: '',
    type: 'retail',
    category: 'other',
    email: '',
    phoneNumber: '',
    faxNumber: '',
    website: '',
    contactPerson: {
      name: '',
      position: '',
      email: '',
      phone: '',
      mobile: ''
    },
    address: {
      unitNumber: '',
      floor: '',
      building: '',
      street: '',
      city: '',
      state: '',
      country: 'UAE',
      postalCode: ''
    },
    businessDetails: {
      registrationNumber: '',
      taxId: '',
      licenseNumber: '',
      businessHours: {}
    },
    leaseDetails: {
      startDate: '',
      endDate: '',
      rentAmount: 0,
      rentCurrency: 'AED',
      securityDeposit: 0,
      maintenanceFee: 0
    }
  })

  const { data: mallsData } = useQuery('malls', () => mallsApi.getMalls())

  const registerMutation = useMutation(
    (data: TenantFormData) => tenantsApi.registerTenant(data),
    {
      onSuccess: (data) => {
        toast.success('Tenant registration submitted successfully!')
        navigate('/tenants')
      },
      onError: () => {
        toast.error('Failed to register tenant')
      }
    }
  )

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleContactPersonChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactPerson: {
        ...prev.contactPerson,
        [field]: value
      }
    }))
  }

  const handleAddressChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }))
  }

  const handleBusinessDetailsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      businessDetails: {
        ...prev.businessDetails,
        [field]: value
      }
    }))
  }

  const handleLeaseDetailsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      leaseDetails: {
        ...prev.leaseDetails,
        [field]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    registerMutation.mutate(formData)
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  const steps = [
    { number: 1, title: 'Basic Information', icon: Store },
    { number: 2, title: 'Contact Details', icon: User },
    { number: 3, title: 'Business Details', icon: FileText },
    { number: 4, title: 'Lease Information', icon: Calendar }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            <h1 className="text-2xl font-bold text-gray-900">Register New Tenant</h1>
            <p className="mt-1 text-sm text-gray-500">
              Complete the registration form to add a new tenant
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="card">
        <div className="card-content">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep === step.number
              const isCompleted = currentStep > step.number

              return (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    isActive ? 'border-primary-600 bg-primary-600 text-white' :
                    isCompleted ? 'border-primary-600 bg-primary-600 text-white' :
                    'border-gray-300 bg-gray-50 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <span className="text-sm font-medium">✓</span>
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isActive ? 'text-primary-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      isCompleted ? 'bg-primary-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
              <p className="text-sm text-gray-500">Enter the basic details about the tenant</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mall *
                  </label>
                  <select
                    value={formData.mallId}
                    onChange={(e) => handleInputChange('mallId', e.target.value)}
                    className="input"
                    required
                  >
                    <option value="">Select Mall</option>
                    {mallsData?.malls?.map((mall: any) => (
                      <option key={mall.id} value={mall.id}>
                        {mall.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    className="input"
                    placeholder="Enter business name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trading Name
                  </label>
                  <input
                    type="text"
                    value={formData.tradingName}
                    onChange={(e) => handleInputChange('tradingName', e.target.value)}
                    className="input"
                    placeholder="Enter trading name (if different)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="input"
                    required
                  >
                    {tenantTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Business Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="input"
                    required
                  >
                    {businessCategories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="input"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Contact Details */}
        {currentStep === 2 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Contact Details</h2>
              <p className="text-sm text-gray-500">Enter contact information and address</p>
            </div>
            <div className="card-content space-y-6">
              {/* Contact Person */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Contact Person</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson.name}
                      onChange={(e) => handleContactPersonChange('name', e.target.value)}
                      className="input"
                      placeholder="Enter full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Position *
                    </label>
                    <input
                      type="text"
                      value={formData.contactPerson.position}
                      onChange={(e) => handleContactPersonChange('position', e.target.value)}
                      className="input"
                      placeholder="Enter position"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.contactPerson.email}
                      onChange={(e) => handleContactPersonChange('email', e.target.value)}
                      className="input"
                      placeholder="Enter email"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPerson.phone}
                      onChange={(e) => handleContactPersonChange('phone', e.target.value)}
                      className="input"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mobile
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPerson.mobile}
                      onChange={(e) => handleContactPersonChange('mobile', e.target.value)}
                      className="input"
                      placeholder="Enter mobile number"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-md font-medium text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit Number
                    </label>
                    <input
                      type="text"
                      value={formData.address.unitNumber}
                      onChange={(e) => handleAddressChange('unitNumber', e.target.value)}
                      className="input"
                      placeholder="Enter unit number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Floor
                    </label>
                    <input
                      type="text"
                      value={formData.address.floor}
                      onChange={(e) => handleAddressChange('floor', e.target.value)}
                      className="input"
                      placeholder="Enter floor"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="input"
                      placeholder="Enter street address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      className="input"
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province *
                    </label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      className="input"
                      placeholder="Enter state/province"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => handleAddressChange('country', e.target.value)}
                      className="input"
                      placeholder="Enter country"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      value={formData.address.postalCode}
                      onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                      className="input"
                      placeholder="Enter postal code"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Business Details */}
        {currentStep === 3 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Business Details</h2>
              <p className="text-sm text-gray-500">Enter business registration and operational details</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.businessDetails.registrationNumber}
                    onChange={(e) => handleBusinessDetailsChange('registrationNumber', e.target.value)}
                    className="input"
                    placeholder="Enter registration number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.businessDetails.taxId}
                    onChange={(e) => handleBusinessDetailsChange('taxId', e.target.value)}
                    className="input"
                    placeholder="Enter tax ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={formData.businessDetails.licenseNumber}
                    onChange={(e) => handleBusinessDetailsChange('licenseNumber', e.target.value)}
                    className="input"
                    placeholder="Enter license number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className="input"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fax Number
                  </label>
                  <input
                    type="tel"
                    value={formData.faxNumber}
                    onChange={(e) => handleInputChange('faxNumber', e.target.value)}
                    className="input"
                    placeholder="Enter fax number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className="input"
                    placeholder="Enter website URL"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Lease Information */}
        {currentStep === 4 && (
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Lease Information</h2>
              <p className="text-sm text-gray-500">Enter lease terms and financial details</p>
            </div>
            <div className="card-content space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.leaseDetails.startDate}
                    onChange={(e) => handleLeaseDetailsChange('startDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lease End Date
                  </label>
                  <input
                    type="date"
                    value={formData.leaseDetails.endDate}
                    onChange={(e) => handleLeaseDetailsChange('endDate', e.target.value)}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Rent Amount
                  </label>
                  <input
                    type="number"
                    value={formData.leaseDetails.rentAmount}
                    onChange={(e) => handleLeaseDetailsChange('rentAmount', parseFloat(e.target.value) || 0)}
                    className="input"
                    placeholder="Enter rent amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.leaseDetails.rentCurrency}
                    onChange={(e) => handleLeaseDetailsChange('rentCurrency', e.target.value)}
                    className="input"
                  >
                    {currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Deposit
                  </label>
                  <input
                    type="number"
                    value={formData.leaseDetails.securityDeposit}
                    onChange={(e) => handleLeaseDetailsChange('securityDeposit', parseFloat(e.target.value) || 0)}
                    className="input"
                    placeholder="Enter security deposit"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monthly Maintenance Fee
                  </label>
                  <input
                    type="number"
                    value={formData.leaseDetails.maintenanceFee}
                    onChange={(e) => handleLeaseDetailsChange('maintenanceFee', parseFloat(e.target.value) || 0)}
                    className="input"
                    placeholder="Enter maintenance fee"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn btn-secondary disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn btn-primary"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={registerMutation.isLoading}
                className="btn btn-primary"
              >
                {registerMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Registration
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
