<template>
  <div class="min-h-screen">
    
      <UiContainer class="py-8 vehicles-section">
    <div class="flex gap-4">
      <!-- Sidebar Filters (Desktop) -->
      <div class="hidden lg:block w-72 flex-shrink-0">
        <div class="sticky top-28">
          <VehicleFilterSidebar
            :loading="loading"
            @update:filters="handleFiltersUpdate"
          />
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden mb-6">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg">
            <UiButton 
              variant="ghost" 
              class="w-full text-white hover:bg-white/20 border-white/30 font-medium" 
              @click="showMobileFilters = true"
            >
              <Icon name="heroicons:funnel-20-solid" class="w-5 h-5 mr-2" />
              Filtros de Busca
              <UiBadge v-if="activeFiltersCount > 0" color="yellow" variant="solid" size="sm" class="ml-auto">
                {{ activeFiltersCount }}
              </UiBadge>
            </UiButton>
            
            <!-- Quick filters preview -->
            <div v-if="activeFiltersCount > 0" class="mt-3 flex flex-wrap gap-2">
              <div 
                v-if="filters.make" 
                class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full"
              >
                <span class="text-xs text-white">{{ filters.make }}</span>
                <button class="ml-1" @click="filters.make = ''; handleFiltersUpdate(filters)">
                  <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white/80" />
                </button>
              </div>
              <div 
                v-if="filters.uf" 
                class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full"
              >
                <span class="text-xs text-white">{{ filters.uf }}</span>
                <button class="ml-1" @click="filters.uf = ''; handleFiltersUpdate(filters)">
                  <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white/80" />
                </button>
              </div>
              <div 
                v-if="filters.priceRange" 
                class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full"
              >
                <span class="text-xs text-white">Preço selecionado</span>
                <button class="ml-1" @click="filters.priceRange = ''; handleFiltersUpdate(filters)">
                  <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white/80" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Loading -->
        <div v-if="loading" class="flex justify-center py-12">
          <div class="text-center">
            <Icon name="heroicons:arrow-path-20-solid" class="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
            <p class="text-gray-600">Carregando veículos...</p>
          </div>
        </div>

        <!-- Vehicles grid -->
        <div 
          v-else-if="vehicles.length > 0" 
          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-3"
        >
          <VehicleCard 
            v-for="vehicle in vehicles" 
            :key="vehicle.id"
            :title="vehicle.title"
            :href="`/carro/${vehicle.id}`"
            :cover-image-url="vehicle.coverImageUrl"
            :brand="vehicle.brand"
            :price="vehicle.price"
            :year="vehicle.year"
            :km="vehicle.km"
            :uf="vehicle.uf"
            :horsepower="vehicle.horsepower"
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:magnifying-glass-20-solid" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
          <p class="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
          <UiButton variant="outline" @click="clearFiltersAndReload">
            Limpar filtros
          </UiButton>
        </div>

        <!-- Pagination -->
        <div v-if="vehicles.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center gap-2">
            <UiButton 
              :disabled="currentPage === 1"
              variant="outline"
              size="sm"
              @click="goToPage(currentPage - 1)"
            >
              <Icon name="heroicons:chevron-left-20-solid" class="w-4 h-4" />
            </UiButton>
            
            <span class="text-sm text-gray-600 px-3">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <UiButton 
              :disabled="currentPage === totalPages"
              variant="outline"
              size="sm"
              @click="goToPage(currentPage + 1)"
            >
              <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4" />
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Filter Modal -->
    <UiModal v-model="showMobileFilters" title="Filtros V2">
      <VehicleFilterSidebar
        :loading="loading"
        @update:filters="handleFiltersUpdate"
        @close="showMobileFilters = false"
      />
    </UiModal>
    </UiContainer>
  </div>
</template>

<script setup lang="ts">
import type { SearchResult, VehicleSummary } from '@/schemas/vehicle'

useHead({
  title: 'Auto URBAN - Encontre o seu carro ideal',
  meta: [
    { name: 'description', content: 'Marketplace de veículos seminovos e novos. Encontre o carro perfeito com os melhores preços e condições.' }
  ]
})

interface Filters {
  sort?: string
  make?: string
  model?: string
  yearMin?: string
  yearMax?: string
  priceMin?: string
  priceMax?: string
  priceRange?: string
  kmRange?: string
  kmMin?: string
  kmMax?: string
  uf?: string
  color?: string
}

const searchQuery = ref('')
const vehicles = ref<VehicleSummary[]>([])
const loading = ref(false)
const showMobileFilters = ref(false)

// Pagination
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)

// Filters
const filters = ref<Filters>({
  sort: 'recent'
})

// Computed
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const activeFiltersCount = computed(() => {
  return Object.keys(filters.value).filter(key => {
    const value = filters.value[key as keyof Filters]
    return value && value !== '' && key !== 'sort'
  }).length
})

// Methods
const scrollToVehicles = () => {
  const vehiclesSection = document.querySelector('.vehicles-section')
  if (vehiclesSection) {
    vehiclesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

async function loadVehicles() {
  loading.value = true
  
  try {
    const queryParams: Record<string, string | number> = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    // Add search query
    if (searchQuery.value) {
      queryParams.q = searchQuery.value
    }

    // Add filters - mapeando para os nomes corretos do endpoint
    if (filters.value.make) queryParams.brand = filters.value.make
    if (filters.value.model) queryParams.model = filters.value.model
    if (filters.value.uf) queryParams.uf = filters.value.uf
    if (filters.value.yearMin) queryParams.yearMin = filters.value.yearMin
    if (filters.value.yearMax) queryParams.yearMax = filters.value.yearMax
    if (filters.value.priceMin) queryParams.priceMin = filters.value.priceMin
    if (filters.value.priceMax) queryParams.priceMax = filters.value.priceMax
    if (filters.value.kmMax) queryParams.kmMax = filters.value.kmMax
    if (filters.value.sort) queryParams.sort = filters.value.sort
    
    console.log('Loading vehicles with params:', queryParams)
    
    const response = await $fetch<SearchResult>('/api/vehicles', {
      query: queryParams
    })
    
    console.log('API Response:', response)
    
    vehicles.value = response.items || []
    total.value = response.total || 0
  } catch (error) {
    console.error('Load vehicles error:', error)
    vehicles.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const handleFiltersUpdate = async (newFilters: Filters) => {
  filters.value = { ...newFilters }
  currentPage.value = 1
  await loadVehicles()
}

const clearFiltersAndReload = async () => {
  filters.value = { sort: 'recent' }
  searchQuery.value = ''
  currentPage.value = 1
  await loadVehicles()
}

const goToPage = async (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    await loadVehicles()
    scrollToVehicles()
  }
}

// Load initial data
onMounted(async () => {
  await loadVehicles()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
