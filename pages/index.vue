<template>
  <div class="min-h-screen">
    <div class="">
        <div class="max-w-2xl mx-auto text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Encontre o seu carro ideal
          </h1>
          <p class="text-gray-600 mb-4">
            Milhares de veículos seminovos e novos esperando por você
          </p>
          
        </div>
    </div>
    
    <!-- Results Section -->
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
