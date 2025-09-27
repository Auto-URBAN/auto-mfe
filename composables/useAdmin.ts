// useAdmin composable - replacement for Pinia admin store
import { z } from 'zod'

// Admin Statistics Schema
const AdminStatsSchema = z.object({
  totalUsers: z.number(),
  totalVehicles: z.number(),
  totalAds: z.number(),
  monthlyRevenue: z.number(),
  activeUsers: z.number(),
  pendingApprovals: z.number(),
  totals: z.object({
    vehicles: z.number(),
    pending: z.number(),
    approved: z.number(),
    users: z.number()
  }),
  byBrand: z.array(z.object({
    brand: z.string(),
    count: z.number()
  })).optional(),
  byUF: z.array(z.object({
    state: z.string(),
    count: z.number()
  })).optional()
})

// User Management Schema
const AdminUserSchema = z.object({
  id: z.string(),
  phone: z.string(),
  role: z.enum(['USER', 'ADMIN']),
  status: z.enum(['ACTIVE', 'SUSPENDED']),
  createdAt: z.date().optional(),
  lastLogin: z.date().optional()
})

// Vehicle Management Schema
const AdminVehicleSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(['APPROVED', 'PENDING', 'REJECTED']),
  userId: z.string(),
  createdAt: z.date().optional(),
  price: z.number()
})

// Admin composable state
const adminState = reactive({
  stats: null as z.infer<typeof AdminStatsSchema> | null,
  users: [] as z.infer<typeof AdminUserSchema>[],
  vehicles: [] as z.infer<typeof AdminVehicleSchema>[],
  loading: false,
  error: null as string | null
})

export const useAdmin = () => {
  const auth = useAuth()
  
  // Reactive state
  const stats = toRef(adminState, 'stats')
  const users = toRef(adminState, 'users')
  const vehicles = toRef(adminState, 'vehicles')
  const loading = toRef(adminState, 'loading')
  const error = toRef(adminState, 'error')

  // Check if user is admin
  const isAdmin = computed(() => auth.isAdmin.value)

  // Load admin statistics
  const loadStats = async () => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    adminState.loading = true
    adminState.error = null
    
    try {
      const response = await $fetch('/api/admin/stats')
      const validatedStats = AdminStatsSchema.parse(response)
      adminState.stats = validatedStats
      return validatedStats
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics'
      adminState.error = errorMessage
      console.error('Admin stats error:', err)
      throw err
    } finally {
      adminState.loading = false
    }
  }

  // Load all users
  const loadUsers = async () => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    adminState.loading = true
    adminState.error = null
    
    try {
      const response = await $fetch('/api/admin/users')
      
      // Validate array of users
      const UsersArraySchema = z.array(AdminUserSchema)
      const validatedUsers = UsersArraySchema.parse(response)
      
      adminState.users = validatedUsers
      return validatedUsers
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load users'
      adminState.error = errorMessage
      console.error('Admin users error:', err)
      throw err
    } finally {
      adminState.loading = false
    }
  }

  // Load all vehicles
  const loadVehicles = async () => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    adminState.loading = true
    adminState.error = null
    
    try {
      const response = await $fetch('/api/admin/vehicles')
      
      // Validate array of vehicles
      const VehiclesArraySchema = z.array(AdminVehicleSchema)
      const validatedVehicles = VehiclesArraySchema.parse(response)
      
      adminState.vehicles = validatedVehicles
      return validatedVehicles
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicles'
      adminState.error = errorMessage
      console.error('Admin vehicles error:', err)
      throw err
    } finally {
      adminState.loading = false
    }
  }

  // Update user status
  const updateUserStatus = async (userId: string, status: 'ACTIVE' | 'SUSPENDED') => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    // Validate inputs
    const UserIdSchema = z.string().uuid()
    const StatusSchema = z.enum(['ACTIVE', 'SUSPENDED'])
    
    const validatedUserId = UserIdSchema.parse(userId)
    const validatedStatus = StatusSchema.parse(status)

    try {
      const response = await $fetch(`/api/admin/users/${validatedUserId}/status`, {
        method: 'PATCH',
        body: { status: validatedStatus }
      })

      // Update local state
      const userIndex = adminState.users.findIndex(u => u.id === validatedUserId)
      if (userIndex !== -1 && adminState.users[userIndex]) {
        adminState.users[userIndex].status = validatedStatus
      }

      return response
    } catch (err) {
      console.error('Update user status error:', err)
      throw err
    }
  }

  // Update vehicle status
  const updateVehicleStatus = async (vehicleId: string, status: 'APPROVED' | 'PENDING' | 'REJECTED') => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    // Validate inputs
    const VehicleIdSchema = z.string().uuid()
    const StatusSchema = z.enum(['APPROVED', 'PENDING', 'REJECTED'])
    
    const validatedVehicleId = VehicleIdSchema.parse(vehicleId)
    const validatedStatus = StatusSchema.parse(status)

    try {
      const response = await $fetch(`/api/admin/vehicles/${validatedVehicleId}/status`, {
        method: 'PATCH',
        body: { status: validatedStatus }
      })

      // Update local state
      const vehicleIndex = adminState.vehicles.findIndex(v => v.id === validatedVehicleId)
      if (vehicleIndex !== -1 && adminState.vehicles[vehicleIndex]) {
        adminState.vehicles[vehicleIndex].status = validatedStatus
      }

      return response
    } catch (err) {
      console.error('Update vehicle status error:', err)
      throw err
    }
  }

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    const UserIdSchema = z.string().uuid()
    const validatedUserId = UserIdSchema.parse(userId)

    try {
      await $fetch(`/api/admin/users/${validatedUserId}`, {
        method: 'DELETE'
      })

      // Remove from local state
      adminState.users = adminState.users.filter(u => u.id !== validatedUserId)
      
      return true
    } catch (err) {
      console.error('Delete user error:', err)
      throw err
    }
  }

  // Delete vehicle
  const deleteVehicle = async (vehicleId: string) => {
    if (!isAdmin.value) {
      throw new Error('Access denied: Admin required')
    }

    const VehicleIdSchema = z.string().uuid()
    const validatedVehicleId = VehicleIdSchema.parse(vehicleId)

    try {
      await $fetch(`/api/admin/vehicles/${validatedVehicleId}`, {
        method: 'DELETE'
      })

      // Remove from local state
      adminState.vehicles = adminState.vehicles.filter(v => v.id !== validatedVehicleId)
      
      return true
    } catch (err) {
      console.error('Delete vehicle error:', err)
      throw err
    }
  }

  // Clear admin data
  const clearAdminData = () => {
    adminState.stats = null
    adminState.users = []
    adminState.vehicles = []
    adminState.error = null
    adminState.loading = false
  }

  return {
    // State
    stats,
    users,
    vehicles,
    loading,
    error,
    
    // Getters
    isAdmin,
    
    // Actions
    loadStats,
    loadUsers,
    loadVehicles,
    updateUserStatus,
    updateVehicleStatus,
    deleteUser,
    deleteVehicle,
    clearAdminData
  }
}