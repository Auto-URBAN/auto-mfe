<template>
  <div class="min-h-screen container mx-auto">
    <!-- Search Hero Section -->
    <div class="bg-white shadow-sm ">
      <div class="">
        <div class="max-w-2xl mx-auto text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Encontre o seu carro ideal
          </h1>
          <p class="text-gray-600">
            Milhares de veículos seminovos e novos esperando por você
          </p>
        </div>
        
        <!-- Search Input -->
        <div class="max-w-xl mx-auto mb-4">
          <SearchInput 
            @search="handleSearch"
            @clear="handleSearchClear"
            placeholder="Busque por marca, modelo, cor..."
          />
        </div>
      </div>
    </div>
    
    <!-- Filter Bar -->
    <FilterBar @filter-change="handleFilterChange" />
    
    <!-- Results Section -->
    <div class="mx-auto px-4 py-6">
      <!-- Results header -->
      <div v-if="!vehiclesStore.loading.search" class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ searchResultsTitle }}
          </h2>
          <p class="text-sm text-gray-500">
            {{ vehiclesStore.vehicles.length }} de {{ vehiclesStore.pagination.total }} resultados
          </p>
        </div>
        
        <!-- Sort options -->
        <div class="hidden md:block">
          <USelectMenu 
            v-model="sortBy"
            :options="sortOptions"
            @change="handleSortChange"
            size="sm"
          />
        </div>
      </div>
      
      <!-- Vehicle Grid -->
      <VehicleGrid 
        :vehicles="vehiclesStore.vehicles"
        :loading="vehiclesStore.loading.search"
        :loading-more="loadingMore"
        :has-more="vehiclesStore.pagination.hasMore"
        :total-results="vehiclesStore.pagination.total"
        @load-more="handleLoadMore"
        @clear-filters="handleClearFilters"
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import type { SearchFilters } from '@/schemas/vehicle'

// Meta tags
useHead({
  title: 'Auto URBAN - Encontre o seu carro ideal',
  meta: [
    { name: 'description', content: 'Marketplace de veículos seminovos e novos. Encontre o carro perfeito com os melhores preços e condições.' }
  ]
})

// Store
const vehiclesStore = useVehiclesStore()

// State
const searchQuery = ref('')
const currentFilters = ref<SearchFilters>({})
const sortBy = ref('recent')
const loadingMore = ref(false)

// Sort options
const sortOptions = [
  { label: 'Mais recentes', value: 'recent' },
  { label: 'Menor preço', value: 'price_asc' },
  { label: 'Maior preço', value: 'price_desc' },
  { label: 'Menor quilometragem', value: 'km_asc' },
  { label: 'Ano mais novo', value: 'year_desc' }
]

// Computed
const searchResultsTitle = computed(() => {
  if (searchQuery.value) {
    return `Resultados para "${searchQuery.value}"`
  }
  
  const activeFilters = Object.values(currentFilters.value).filter(v => v !== '' && v !== undefined)
  if (activeFilters.length > 0) {
    return 'Resultados filtrados'
  }
  
  return 'Todos os veículos'
})

// Methods
async function handleSearch(query: string) {
  searchQuery.value = query
  await performSearch()
}

function handleSearchClear() {
  searchQuery.value = ''
  performSearch()
}

async function handleFilterChange(filters: SearchFilters) {
  currentFilters.value = { ...filters }
  await performSearch()
}

async function handleSortChange() {
  await performSearch()
}

async function handleLoadMore() {
  if (!vehiclesStore.pagination.hasMore || loadingMore.value) return
  
  loadingMore.value = true
  
  try {
    await vehiclesStore.loadMoreVehicles()
  } catch (error) {
    console.error('Error loading more vehicles:', error)
  } finally {
    loadingMore.value = false
  }
}

function handleClearFilters() {
  searchQuery.value = ''
  currentFilters.value = {}
  sortBy.value = 'recent'
  performSearch()
}

async function performSearch() {
  try {
    await vehiclesStore.searchVehicles({
      ...currentFilters.value,
      q: searchQuery.value || undefined,
      sort: sortBy.value
    })
  } catch (error) {
    console.error('Search error:', error)
  }
}

// Load initial data
onMounted(async () => {
  // Try to load from cache first (PWA feature)
  await vehiclesStore.loadVehiclesFromCache()
  
  // If no cache or cache is stale, fetch fresh data
  if (vehiclesStore.vehicles.length === 0) {
    await performSearch()
  }
})

// PWA: Save to cache when vehicles change
watch(() => vehiclesStore.vehicles, (newVehicles) => {
  if (newVehicles.length > 0) {
    vehiclesStore.saveVehiclesToCache()
  }
}, { deep: true })
</script>
