<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <div class="relative bg-[url('/imgs/background.jpg')] bg-cover bg-center">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black/0"></div>
      
      <!-- Content -->
      <div class="relative py-20 px-4 sm:px-6 lg:px-8">
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
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="heroicons:chevron-down-20-solid" class="w-6 h-6 text-white/60" />
      </div>
    </div>
    
      <UiContainer class="py-6 vehicles-section">
    <div>
      <!-- Results header -->
      <div v-if="!loading && vehicles.length > 0" class="flex justify-between items-center mb-6">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            Todos os veículos
          </h2>
          <p class="text-sm text-gray-600">
            {{ vehicles.length }} veículos encontrados
          </p>
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
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
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
        <UiButton @click="loadVehicles" variant="outline">
          Recarregar
        </UiButton>
      </div>
    </div>
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

const searchQuery = ref('')
const vehicles = ref<any[]>([])
const loading = ref(false)

// Auth
const { isAuthenticated, userName, logout } = useAuth()

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
    const response = await $fetch('/api/cars/search', {
      query: {
        page: 1,
        pageSize: 20
      }
    })
    
    vehicles.value = response.items || []
  } catch (error) {
    console.error('Load vehicles error:', error)
  } finally {
    loading.value = false
  }
}

async function performSearch() {
  loading.value = true
  
  try {
    const response = await $fetch('/api/cars/search', {
      query: {
        page: 1,
        pageSize: 20,
        q: searchQuery.value || undefined
      }
    })
    
    vehicles.value = response.items || []
  } catch (error) {
    console.error('Search error:', error)
  } finally {
    loading.value = false
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
