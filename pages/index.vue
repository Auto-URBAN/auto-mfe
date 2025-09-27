<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Search Hero Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto text-center mb-6">
          <h1 class="text-3xl font-bold text-gray-900 mb-2">
            Encontre o seu carro ideal
          </h1>
          <p class="text-gray-600">
            Milhares de veículos seminovos e novos esperando por você
          </p>
        </div>
        
        <!-- Simple Search Input -->
        <div class="max-w-xl mx-auto mb-4">
          <UInput
            v-model="searchQuery"
            placeholder="Busque por marca, modelo, cor..."
            size="lg"
            @keyup.enter="performSearch"
          >
            <template #leading>
              <UIcon name="i-heroicons-magnifying-glass" class="text-gray-400" />
            </template>
          </UInput>
        </div>
      </div>
    </div>
    
    <!-- Results Section -->
    <div class="container mx-auto px-4 py-6">
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
          <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-blue-500 mx-auto mb-2" />
          <p class="text-gray-600">Carregando veículos...</p>
        </div>
      </div>

      <!-- Vehicles grid -->
      <div 
        v-else-if="vehicles.length > 0" 
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div 
          v-for="vehicle in vehicles" 
          :key="vehicle.id" 
          class="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer"
          @click="goToVehicle(vehicle.id)"
        >
          <!-- Image -->
          <div class="relative aspect-[4/3] rounded-t-lg overflow-hidden">
            <img 
              :src="vehicle.coverImageUrl || '/imgs/search-example.jpg'" 
              :alt="vehicle.title"
              class="w-full h-full object-cover"
              loading="lazy"
            >
          </div>

          <!-- Content -->
          <div class="p-4">
            <!-- Title -->
            <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-2">
              {{ vehicle.title }}
            </h3>

            <!-- Price -->
            <div class="mb-3">
              <span class="text-xl font-bold text-green-600">
                {{ formatCurrency(vehicle.price) }}
              </span>
            </div>

            <!-- Vehicle info -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {{ vehicle.year }}
              </span>
              <span class="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                {{ formatKm(vehicle.km) }}
              </span>
              <span class="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                {{ vehicle.uf }}
              </span>
            </div>

            <!-- Location -->
            <p class="text-sm text-gray-600 mb-4">
              {{ vehicle.city }}, {{ vehicle.uf }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-12">
        <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
        <p class="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
        <UButton @click="loadVehicles" color="primary" variant="outline">
          Recarregar
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Meta tags
useHead({
  title: 'Auto URBAN - Encontre o seu carro ideal',
  meta: [
    { name: 'description', content: 'Marketplace de veículos seminovos e novos. Encontre o carro perfeito com os melhores preços e condições.' }
  ]
})

// State
const searchQuery = ref('')
const vehicles = ref<any[]>([])
const loading = ref(false)

// Methods
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
  navigateTo(`/vehicle/${id}`)
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
