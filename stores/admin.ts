import { defineStore } from 'pinia'
import type { AdminState, AdminMetrics, DashboardData } from '@/schemas/admin'
import type { VehicleSummary } from '@/schemas/vehicle'
import type { UserWithAds } from '@/schemas/user'

export const useAdminStore = defineStore('admin', () => {
    // State
    const state = ref<AdminState>({
        metrics: null,
        vehiclesByStatus: {
            pending: [],
            approved: [],
            rejected: []
        },
        users: [],
        loading: {
            metrics: false,
            vehicles: false,
            users: false,
            moderating: false
        }
    })

    const dashboardData = ref<DashboardData | null>(null)
    const error = ref<string | null>(null)

    // Getters
    const isLoading = computed(() => {
        const { loading } = state.value
        return loading.metrics || loading.vehicles || loading.users || loading.moderating
    })

    const pendingCount = computed(() => state.value.vehiclesByStatus.pending.length)
    const approvedCount = computed(() => state.value.vehiclesByStatus.approved.length)
    const rejectedCount = computed(() => state.value.vehiclesByStatus.rejected.length)
    const totalUsers = computed(() => state.value.users.length)
    const activeUsers = computed(() => state.value.users.length) // All loaded users are considered active
    const hasMetrics = computed(() => state.value.metrics !== null)

    // Vehicle getters
    const vehiclesByStatus = (status: 'PENDING' | 'APPROVED' | 'REJECTED') => {
        return state.value.vehiclesByStatus[status.toLowerCase() as keyof typeof state.value.vehiclesByStatus] || []
    }

    const allVehicles = computed(() => {
        return [
            ...state.value.vehiclesByStatus.pending,
            ...state.value.vehiclesByStatus.approved,
            ...state.value.vehiclesByStatus.rejected
        ]
    })

    // User getters
    const users = computed(() => state.value.users)
    const metrics = computed(() => state.value.metrics)
    const adminUsers = computed(() => state.value.users.filter(u => u.role === 'ADMIN'))
    const regularUsers = computed(() => state.value.users.filter(u => u.role === 'USER'))

    // Actions
    async function loadMetrics() {
        state.value.loading.metrics = true
        error.value = null

        try {
            const response = await $fetch('/api/admin/metrics')
            state.value.metrics = response
        } catch (err) {
            error.value = 'Erro ao carregar métricas'
            console.error('Metrics loading error:', err)
        } finally {
            state.value.loading.metrics = false
        }
    }

    async function loadVehiclesByStatus() {
        state.value.loading.vehicles = true
        error.value = null

        try {
            // Mock vehicles - replace with real API
            await new Promise(resolve => setTimeout(resolve, 600))

            state.value.vehiclesByStatus = {
                pending: [
                    {
                        id: '1',
                        title: 'Honda Civic 1.5 VTEC TURBO 2021',
                        brand: 'Honda',
                        model: 'Civic',
                        year: 2021,
                        price: 85000,
                        km: 25000,
                        city: 'São Paulo',
                        uf: 'SP',
                        coverImageUrl: '/imgs/search-example.jpg',
                        status: 'PENDING',
                        createdAt: new Date()
                    },
                    {
                        id: '2',
                        title: 'Toyota Corolla 2.0 VVT-IE FLEX 2020',
                        brand: 'Toyota',
                        model: 'Corolla',
                        year: 2020,
                        price: 78000,
                        km: 32000,
                        city: 'Rio de Janeiro',
                        uf: 'RJ',
                        coverImageUrl: '/imgs/search-example.jpg',
                        status: 'PENDING',
                        createdAt: new Date()
                    }
                ],
                approved: [],
                rejected: []
            }

        } catch (err) {
            error.value = 'Erro ao carregar veículos'
            console.error('Vehicles loading error:', err)
        } finally {
            state.value.loading.vehicles = false
        }
    }

    async function loadUsers() {
        state.value.loading.users = true
        error.value = null

        try {
            const response = await $fetch('/api/admin/users')
            // Map API response to store format
            state.value.users = response.map((user: any) => ({
                id: user.id,
                phone: user.phone,
                role: user.role,
                adsCount: user.ads?.total || 0,
                createdAt: new Date(user.createdAt),
                updatedAt: new Date()
            }))
        } catch (err) {
            error.value = 'Erro ao carregar usuários'
            console.error('Users loading error:', err)
        } finally {
            state.value.loading.users = false
        }
    }

    async function loadDashboard() {
        try {
            // Mock dashboard data
            await new Promise(resolve => setTimeout(resolve, 500))

            dashboardData.value = {
                cards: [
                    {
                        title: 'Total de Veículos',
                        value: 1247,
                        change: { value: 12, type: 'increase', period: 'vs mês passado' },
                        color: 'primary'
                    },
                    {
                        title: 'Pendentes',
                        value: 23,
                        change: { value: 5, type: 'decrease', period: 'vs semana passada' },
                        color: 'warning'
                    },
                    {
                        title: 'Usuários Ativos',
                        value: 856,
                        change: { value: 45, type: 'increase', period: 'vs mês passado' },
                        color: 'success'
                    }
                ],
                topBrands: [
                    { brand: 'Toyota', count: 234 },
                    { brand: 'Honda', count: 189 },
                    { brand: 'Volkswagen', count: 167 }
                ],
                topStates: [
                    { uf: 'SP', count: 423 },
                    { uf: 'RJ', count: 312 },
                    { uf: 'MG', count: 189 }
                ],
                recentActivity: [
                    {
                        id: '1',
                        type: 'vehicle_approved',
                        description: 'Honda Civic 2020 foi aprovado',
                        timestamp: new Date(),
                        userId: 'user123'
                    },
                    {
                        id: '2',
                        type: 'user_registered',
                        description: 'Novo usuário: João Silva',
                        timestamp: new Date(Date.now() - 86400000),
                        userId: 'user124'
                    }
                ]
            }

        } catch (err) {
            error.value = 'Erro ao carregar dashboard'
            console.error('Dashboard loading error:', err)
        }
    }

    async function moderateVehicle(vehicleId: string, action: 'approve' | 'reject', reason?: string) {
        state.value.loading.moderating = true
        error.value = null

        try {
            // Mock moderation - replace with real API
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Find vehicle in pending list
            const vehicleIndex = state.value.vehiclesByStatus.pending.findIndex(v => v.id === vehicleId)

            if (vehicleIndex !== -1) {
                const vehicle = state.value.vehiclesByStatus.pending[vehicleIndex]
                if (!vehicle) return false

                // Remove from pending
                state.value.vehiclesByStatus.pending.splice(vehicleIndex, 1)

                // Add to appropriate list
                if (action === 'approve') {
                    const approvedVehicle = { ...vehicle, status: 'APPROVED' as const }
                    state.value.vehiclesByStatus.approved.push(approvedVehicle)
                } else {
                    const rejectedVehicle = { ...vehicle, status: 'REJECTED' as const }
                    state.value.vehiclesByStatus.rejected.push(rejectedVehicle)
                }

                // Update metrics
                if (state.value.metrics) {
                    state.value.metrics.totals.pending--

                    if (action === 'approve') {
                        state.value.metrics.totals.approved++
                    } else {
                        state.value.metrics.totals.rejected++
                    }
                }

                return true
            }

            return false
        } catch (err) {
            error.value = 'Erro na moderação'
            console.error('Moderation error:', err)
            return false
        } finally {
            state.value.loading.moderating = false
        }
    }

    async function initializeAdmin() {
        await Promise.all([
            loadMetrics(),
            loadVehiclesByStatus(),
            loadUsers(),
            loadDashboard()
        ])
    }

    async function loadVehicles(status?: string) {
        try {
            state.value.loading.vehicles = true
            error.value = null
            
            const response = await $fetch('/api/admin/vehicles', {
                query: status ? { status } : {}
            })
            
            // Clear all status arrays and populate based on response
            state.value.vehiclesByStatus = {
                pending: [],
                approved: [], 
                rejected: []
            }
            
            response.forEach((vehicle: any) => {
                const statusKey = vehicle.status.toLowerCase() as 'pending' | 'approved' | 'rejected'
                if (state.value.vehiclesByStatus[statusKey]) {
                    state.value.vehiclesByStatus[statusKey].push(vehicle)
                }
            })
            
        } catch (err) {
            error.value = 'Erro ao carregar veículos'
            console.error('Load vehicles error:', err)
        } finally {
            state.value.loading.vehicles = false
        }
    }

    async function approveVehicle(vehicleId: string) {
        try {
            state.value.loading.moderating = true
            await $fetch(`/api/admin/vehicles/${vehicleId}/approve`, {
                method: 'POST'
            })
            
            // Reload vehicles to get updated state
            await loadVehicles()
            return { success: true }
        } catch (err) {
            error.value = 'Erro ao aprovar veículo'
            return { success: false, error: 'Erro ao aprovar veículo' }
        } finally {
            state.value.loading.moderating = false
        }
    }

    async function rejectVehicle(vehicleId: string, reason: string) {
        try {
            state.value.loading.moderating = true
            await $fetch(`/api/admin/vehicles/${vehicleId}/reject`, {
                method: 'POST',
                body: { reason }
            })
            
            // Reload vehicles to get updated state
            await loadVehicles()
            return { success: true }
        } catch (err) {
            error.value = 'Erro ao rejeitar veículo'
            return { success: false, error: 'Erro ao rejeitar veículo' }
        } finally {
            state.value.loading.moderating = false
        }
    }

    function clearError() {
        error.value = null
    }

    return {
        // State
        state: readonly(state),
        dashboardData: readonly(dashboardData),
        error: readonly(error),

        // Getters
        isLoading,
        pendingCount,
        approvedCount,
        rejectedCount,
        totalUsers,
        activeUsers,
        hasMetrics,

        // Actions
        loadMetrics,
        loadVehiclesByStatus,
        loadUsers,
        loadDashboard,
        loadVehicles,
        moderateVehicle,
        approveVehicle,
        rejectVehicle,
        initializeAdmin,
        clearError,
        
        // Getters as properties
        vehiclesByStatus,
        allVehicles,
        users,
        metrics,
        adminUsers,
        regularUsers
    }
})