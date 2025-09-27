import { defineStore } from 'pinia'
import { 
  VehicleSummary,
  VehicleDetail, 
  VehiclesState,
  SearchFilters,
  SearchResult,
  VehicleForm,
  type VehicleSummary as VehicleSummaryType,
  type VehicleDetail as VehicleDetailType,
  type VehiclesState as VehiclesStateType,
  type SearchFilters as SearchFiltersType,
  type VehicleStatus
} from '~/schemas'

export const useVehiclesStore = defineStore('vehicles', {
  state: (): VehiclesStateType => ({
    vehicles: [],
    currentVehicle: null,
    myVehicles: [],
    searchFilters: {},
    pagination: {
      page: 1,
      pageSize: 20,
      total: 0,
      hasMore: true
    },
    loading: {
      search: false,
      detail: false,
      myVehicles: false,
      create: false,
      update: false
    }
  }),

  getters: {
    filteredVehicles: (state) => {
      // Apply client-side filtering if needed
      return state.vehicles.filter(vehicle => vehicle.status === 'APPROVED')
    },
    
    vehiclesByStatus: (state) => (status: VehicleStatus) => {
      return state.myVehicles.filter(vehicle => vehicle.status === status)
    },

    hasActiveFilters: (state) => {
      return Object.keys(state.searchFilters).some(key => 
        state.searchFilters[key as keyof SearchFiltersType] !== undefined
      )
    }
  },

  actions: {
    async searchVehicles(filters: SearchFiltersType = {}, loadMore = false) {
      this.loading.search = true
      
      try {
        // Validate filters
        const validatedFilters = SearchFilters.parse(filters)
        const page = loadMore ? this.pagination.page + 1 : 1
        
        const response = await $fetch('/api/vehicles/search', {
          query: {
            ...validatedFilters,
            page,
            pageSize: this.pagination.pageSize
          }
        })

        // Validate response
        const validatedResponse = SearchResult.parse(response)

        if (loadMore) {
          this.vehicles = [...this.vehicles, ...validatedResponse.items]
        } else {
          this.vehicles = validatedResponse.items.map(item => VehicleSummary.parse(item))
          this.searchFilters = validatedFilters
        }

        this.pagination = {
          page: validatedResponse.page,
          pageSize: validatedResponse.pageSize,
          total: validatedResponse.total,
          hasMore: validatedResponse.items.length === validatedResponse.pageSize
        }

        return validatedResponse
      } catch (error) {
        console.error('Search vehicles error:', error)
        throw error
      } finally {
        this.loading.search = false
      }
    },

    async getVehicleById(id: string) {
      this.loading.detail = true
      
      try {
        const response = await $fetch(`/api/vehicles/${id}`)
        
        // Validate response
        const vehicle = VehicleDetail.parse(response)
        this.currentVehicle = vehicle
        
        return vehicle
      } catch (error) {
        console.error('Get vehicle error:', error)
        throw error
      } finally {
        this.loading.detail = false
      }
    },

    async createVehicle(vehicleData: Partial<VehicleDetailType>) {
      this.loading.create = true
      
      try {
        // Validate form data
        const validatedData = VehicleForm.parse(vehicleData)
        
        const response = await $fetch('/api/vehicles', {
          method: 'POST',
          body: validatedData
        })
        
        const newVehicle = VehicleDetail.parse(response)
        this.myVehicles.unshift(newVehicle)
        
        return newVehicle
      } catch (error) {
        console.error('Create vehicle error:', error)
        throw error
      } finally {
        this.loading.create = false
      }
    },

    async updateVehicle(id: string, updates: Partial<VehicleDetailType>) {
      this.loading.update = true
      
      try {
        // Validate updates
        const validatedUpdates = VehicleForm.partial().parse(updates)
        
        const response = await $fetch(`/api/vehicles/${id}`, {
          method: 'PUT',
          body: validatedUpdates
        })
        
        const updatedVehicle = VehicleDetail.parse(response)
        
        const index = this.myVehicles.findIndex(v => v.id === id)
        if (index !== -1) {
          this.myVehicles[index] = updatedVehicle
        }
        
        if (this.currentVehicle?.id === id) {
          this.currentVehicle = updatedVehicle
        }
        
        return updatedVehicle
      } catch (error) {
        console.error('Update vehicle error:', error)
        throw error
      } finally {
        this.loading.update = false
      }
    },

    async deleteVehicle(id: string) {
      try {
        await $fetch(`/api/vehicles/${id}`, {
          method: 'DELETE'
        })
        
        this.myVehicles = this.myVehicles.filter(v => v.id !== id)
        
        if (this.currentVehicle?.id === id) {
          this.currentVehicle = null
        }
      } catch (error) {
        console.error('Delete vehicle error:', error)
        throw error
      }
    },

    async getMyVehicles() {
      this.loading.myVehicles = true
      
      try {
        const response = await $fetch('/api/me/vehicles') as any[]
        
        // Validate response
        const vehicles = response.map(item => VehicleSummary.parse(item))
        this.myVehicles = vehicles
        
        return vehicles
      } catch (error) {
        console.error('Get my vehicles error:', error)
        throw error
      } finally {
        this.loading.myVehicles = false
      }
    },

    clearSearch() {
      this.vehicles = []
      this.searchFilters = {}
      this.pagination = {
        page: 1,
        pageSize: 20,
        total: 0,
        hasMore: true
      }
    },

    setCurrentVehicle(vehicle: VehicleDetailType | null) {
      this.currentVehicle = vehicle ? VehicleDetail.parse(vehicle) : null
    }
  }
})