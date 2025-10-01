<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-[url('/imgs/background.jpg')] bg-cover bg-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/0"></div>
      
      <!-- Content -->
      <div class="relative py-10 px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-4xl sm:text-5xl lg:text-4xl font-black text-white mb-2 leading-tight">
            Busque por 
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              carros legais
            </span>
          </h1>
          
          <p class="text-md text-gray-200 mb-8 max-w-2xl mx-auto font-medium">
            Carros esportivos, clássicos e únicos. 
            <span class="text-blue-300">Chega de carros sem graça!</span>
          </p>
          
          <!-- AI Search -->
          <div class="max-w-2xl mx-auto mb-8">
            <AISearchSuggestions
              @search="handleAISearch"
              @apply-filters="handleAIFilters"
            />
          </div>
          
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <NuxtLink to="/sell" class="group">
              <button class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-xl text-md transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/25">
                <Icon name="heroicons:plus-20-solid" class="w-5 h-5 inline-block mr-2" />
                Anuncie Grátis
              </button>
            </NuxtLink>
            
          </div>
        </div>
      </div>
      
      <!-- Scroll indicator -->
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="heroicons:chevron-down-20-solid" class="w-6 h-6 text-white/60" />
      </div>
    </div>
    
      <UiContainer class="py-8 vehicles-section">
    <div class="flex gap-4">
      <!-- Sidebar Filters (Desktop) -->
      <div class="hidden lg:block w-72 flex-shrink-0">
        <div class="sticky top-28">
          <VehicleFilterSidebarV3
            :loading="loading"
            @update:filters="handleFiltersUpdate"
          />
        </div>
      </div>

      <!-- Main Content -->
      <div class="flex-1 min-w-0 pt-2">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden mb-6">
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 shadow-lg">
            <UiButton 
              @click="showMobileFilters = true" 
              variant="ghost" 
              class="w-full text-white hover:bg-white/20 border-white/30 font-medium"
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
                <button @click="filters.make = ''; handleFiltersUpdate(filters)" class="ml-1">
                  <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white/80" />
                </button>
              </div>
              <div 
                v-if="filters.uf" 
                class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full"
              >
                <span class="text-xs text-white">{{ filters.uf }}</span>
                <button @click="filters.uf = ''; handleFiltersUpdate(filters)" class="ml-1">
                  <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3 text-white/80" />
                </button>
              </div>
              <div 
                v-if="filters.priceRange" 
                class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full"
              >
                <span class="text-xs text-white">Preço selecionado</span>
                <button @click="filters.priceRange = ''; handleFiltersUpdate(filters)" class="ml-1">
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
          class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          <VehicleCard 
            v-for="vehicle in vehicles" 
            :key="vehicle.id" 
            :vehicle="vehicle" 
          />
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12">
          <Icon name="heroicons:magnifying-glass-20-solid" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
          <p class="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
          <UiButton @click="clearFiltersAndReload" variant="outline">
            Limpar filtros
          </UiButton>
        </div>

        <!-- Pagination -->
        <div v-if="vehicles.length > 0 && totalPages > 1" class="mt-8 flex justify-center">
          <div class="flex items-center gap-2">
            <UiButton 
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              variant="outline"
              size="sm"
            >
              <Icon name="heroicons:chevron-left-20-solid" class="w-4 h-4" />
            </UiButton>
            
            <span class="text-sm text-gray-600 px-3">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <UiButton 
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              variant="outline"
              size="sm"
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
const vehicles = ref<any[]>([])
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

// Auth
const { isAuthenticated, userName, logout } = useAuth()

// Computed
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))

const activeFiltersCount = computed(() => {
  return Object.keys(filters.value).filter(key => {
    const value = filters.value[key as keyof Filters]
    return value && value !== '' && key !== 'sort'
  }).length
})

// Methods
const handleLogout = async () => {
  try {
    await logout()
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const scrollToVehicles = () => {
  const vehiclesSection = document.querySelector('.vehicles-section')
  if (vehiclesSection) {
    vehiclesSection.scrollIntoView({ behavior: 'smooth' })
  }
}

async function loadVehicles() {
  loading.value = true
  
  try {
    const queryParams: any = {
      page: currentPage.value,
      pageSize: pageSize.value
    }

    // Add search query
    if (searchQuery.value) {
      queryParams.q = searchQuery.value
    }

    // Add filters
    Object.keys(filters.value).forEach(key => {
      const value = filters.value[key as keyof Filters]
      if (value && value !== '') {
        queryParams[key] = value
      }
    })
    
    console.log('Loading vehicles with params:', queryParams)
    
    const response = await $fetch('/api/cars/search', {
      query: queryParams
    })
    
    console.log('API Response:', response)
    
    vehicles.value = response.items || []
    total.value = response.total || 0
  } catch (error) {
    console.error('Load vehicles error:', error)
    // Fallback para dados mock em caso de erro
    vehicles.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

async function performSearch() {
  currentPage.value = 1
  await loadVehicles()
}

const handleFiltersUpdate = async (newFilters: Filters) => {
  filters.value = { ...newFilters }
  currentPage.value = 1
  await loadVehicles()
}

// AI Search Methods
const handleAISearch = async (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
  await loadVehicles()
}

const handleAIFilters = async (aiFilters: Record<string, any>) => {
  // Merge AI filters with existing filters
  filters.value = { ...filters.value, ...aiFilters }
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

function goToVehicle(id: string) {
  navigateTo(`/carro/${id}`)
}

// Formatters
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value)
}

function formatKm(km: number): string {
  if (km === 0) return '0 km'
  if (km < 1000) return `${km} km`
  return `${(km / 1000).toFixed(0)}k km`
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
