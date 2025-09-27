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
    async searchVehicles(filters?: SearchFiltersType & { sort?: string }) {
      this.loading.search = true
      this.searchFilters = { ...filters } as SearchFiltersType
      
      // Reset pagination for new search
      this.pagination.page = 1
      
      try {
        const response = await $fetch('/api/cars/search', {
          query: {
            ...filters,
            page: this.pagination.page,
            pageSize: this.pagination.pageSize
          }
        }) as SearchResult
        
        // Validate and parse response
        const searchResult = SearchResult.parse(response)
        
        this.vehicles = searchResult.items
        this.pagination = {
          page: searchResult.page,
          pageSize: searchResult.pageSize || 20,
          total: searchResult.total,
          hasMore: searchResult.items.length === this.pagination.pageSize && 
                  searchResult.page * searchResult.pageSize < searchResult.total
        }
        
        return searchResult
      } catch (error) {
        console.error('Search vehicles error:', error)
        throw error
      } finally {
        this.loading.search = false
      }
    },

    async loadMoreVehicles() {
      if (!this.pagination.hasMore) return
      
      const nextPage = this.pagination.page + 1
      
      try {
        const response = await $fetch('/api/cars/search', {
          query: {
            ...this.searchFilters,
            page: nextPage,
            pageSize: this.pagination.pageSize
          }
        }) as SearchResult
        
        const searchResult = SearchResult.parse(response)
        
        // Append new vehicles to existing list
        this.vehicles.push(...searchResult.items)
        
        this.pagination = {
          page: searchResult.page,
          pageSize: searchResult.pageSize || 20, 
          total: searchResult.total,
          hasMore: searchResult.items.length === this.pagination.pageSize && 
                  searchResult.page * searchResult.pageSize < searchResult.total
        }
        
        return searchResult
      } catch (error) {
        console.error('Load more vehicles error:', error)
        throw error
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
    },

    // PWA Cache methods
    async loadVehiclesFromCache() {
      if (process.client && 'indexedDB' in window) {
        try {
          const cachedData = localStorage.getItem('vehicles_cache')
          if (cachedData) {
            const parsed = JSON.parse(cachedData)
            const cacheTime = new Date(parsed.timestamp)
            const now = new Date()
            
            // Cache válido por 1 hora
            if ((now.getTime() - cacheTime.getTime()) < 3600000) {
              this.vehicles = parsed.vehicles.map((v: any) => VehicleSummary.parse(v))
              this.pagination = parsed.pagination
              return true
            }
          }
        } catch (error) {
          console.error('Error loading from cache:', error)
        }
      }
      return false
    },

    async saveVehiclesToCache() {
      if (process.client && this.vehicles.length > 0) {
        try {
          const cacheData = {
            vehicles: this.vehicles,
            pagination: this.pagination,
            timestamp: new Date().toISOString()
          }
          localStorage.setItem('vehicles_cache', JSON.stringify(cacheData))
        } catch (error) {
          console.error('Error saving to cache:', error)
        }
      }
    }
  }
})