<template>
  <div>
    <!-- Breadcrumb -->
    <nav class="mb-6">
      <ol class="flex items-center space-x-2 text-sm">
        <li>
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800">
            Início
          </NuxtLink>
        </li>
        <li>
          <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4 text-gray-400" />
        </li>
        <li>
          <NuxtLink 
            :to="`/?make=${vehicle?.brand}`" 
            class="text-blue-600 hover:text-blue-800"
          >
            {{ vehicle?.brand }}
          </NuxtLink>
        </li>
        <li>
          <Icon name="heroicons:chevron-right-20-solid" class="w-4 h-4 text-gray-400" />
        </li>
        <li class="text-gray-600">
          {{ vehicle?.model }} {{ vehicle?.year }}
        </li>
      </ol>
    </nav>

    <!-- Loading State -->
    <div v-if="pending" class="space-y-6">
      <div class="h-64 lg:h-96 bg-gray-200 animate-pulse rounded-lg" />
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="h-48 bg-gray-200 animate-pulse rounded-lg" />
          <div class="h-32 bg-gray-200 animate-pulse rounded-lg" />
        </div>
        <div class="h-64 bg-gray-200 animate-pulse rounded-lg" />
      </div>
    </div>

    <!-- Error State -->
    <UiAlert
      v-else-if="error"
      variant="danger"
      :title="error.message || 'Erro ao carregar veículo'"
      class="mb-6"
    >
      <template #default>
        <UiButton variant="outline" @click="refresh()">
          Tentar novamente
        </UiButton>
      </template>
    </UiAlert>

    <!-- Vehicle Content -->
    <div v-else-if="vehicle" class="space-y-8">
      <!-- Title and Price -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-2xl lg:text-3xl font-bold text-gray-900">
            {{ vehicle.title }}
          </h1>
          <div class="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>{{ vehicle.km.toLocaleString('pt-BR') }} km</span>
            <span>•</span>
            <span>{{ vehicle.city }}, {{ vehicle.uf }}</span>
            <span>•</span>
            <span>ID: {{ vehicle.id.substring(0, 8) }}</span>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-3xl lg:text-4xl font-bold text-green-600">
            {{ formatCurrency(vehicle.price) }}
          </p>
          <p class="text-sm text-gray-600 mt-1">à vista</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column: Gallery + Specs + Price Chart -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Image Gallery -->
          <VehicleGallery :vehicle="vehicle" />

          <!-- Price History Chart -->
          <div v-if="carData?.prices?.length > 0" class="bg-white rounded-lg shadow-lg p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Histórico de Preços
            </h2>
            <div class="h-80">
              <Chart 
                type="line" 
                :data="{
                  labels: priceLabels,
                  datasets: priceDatasets
                }" 
                :legend="true"
                :options="{
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: {
                    line: {
                      tension: 0.3
                    }
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      ticks: {
                        callback: function(value) {
                          return 'R$ ' + new Intl.NumberFormat('pt-BR').format(value)
                        }
                      }
                    }
                  }
                }" 
              />
            </div>
            <p class="text-sm text-gray-600 mt-4">
              Dados baseados em pesquisas de mercado e anúncios similares
            </p>
          </div>

          <!-- Specifications -->
          <VehicleSpecs :vehicle="vehicle" />
        </div>

        <!-- Right Column: Contact + Price Comparison + Financing -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Contact -->
          <VehicleContact 
            :vehicle="vehicle" 
            :seller="vehicle.seller" 
          />

          <!-- Price Comparison -->
          <div v-if="carData?.partners?.length > 0" class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Comparação de Preços
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="font-medium text-gray-900">Este anúncio</span>
                <span class="text-green-600 font-semibold">{{ formatCurrency(vehicle.price) }}</span>
              </div>
              <hr />
              <div class="text-xs text-gray-600 mb-2">Média de mercado:</div>
              <div 
                v-for="partner in carData.partners" 
                :key="partner.name"
                class="flex justify-between items-center text-sm"
              >
                <span class="text-gray-600">{{ partner.name }}</span>
                <span class="text-gray-900">{{ formatCurrency(partner.value) }}</span>
              </div>
              <hr />
              <div class="flex justify-between items-center text-sm font-medium">
                <span>Média geral</span>
                <span>{{ formatCurrency(averageMarketPrice) }}</span>
              </div>
              <div v-if="priceComparison" class="text-xs mt-2">
                <span 
                  :class="[
                    'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                    priceComparison.isGoodDeal 
                      ? 'bg-green-100 text-green-800' 
                      : priceComparison.isExpensive
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  ]"
                >
                  {{ priceComparison.message }}
                </span>
              </div>
            </div>
          </div>

          <!-- Financing Simulator -->
          <div class="bg-white rounded-lg shadow-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Simulador de Financiamento
            </h3>
            <p class="text-sm text-gray-600 mb-4">
              Simule as condições de financiamento para este veículo
            </p>
            <button
              v-if="!showFinancial"
              @click="showFinancial = true"
              class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Simular Financiamento
            </button>
            <SimpleFinancingSimulator 
              v-if="showFinancial"
              class="w-full" 
              :price="vehicle.price"
            />
          </div>
        </div>
      </div>

      <!-- Related Vehicles -->
      <div v-if="relatedVehicles.length > 0" class="mt-12">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
          Anúncios Similares
        </h2>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <VehicleCard
            v-for="related in relatedVehicles"
            :key="related.id"
            :vehicle="related"
            :show-seller="false"
          />
        </div>
      </div>
    </div>

    <!-- Not Found -->
    <div v-else class="text-center py-12">
      <Icon name="heroicons:exclamation-triangle" class="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-gray-900 mb-2">Veículo não encontrado</h2>
      <p class="text-gray-600 mb-4">
        Este anúncio pode ter sido removido ou não existe.
      </p>
      <UiButton @click="navigateTo('/')">
        Voltar às buscas
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
// Get route params
const route = useRoute()
const vehicleId = route.params.id as string

// Fetch vehicle data
const { data: vehicle, pending, error, refresh } = await useFetch(`/api/vehicles/${vehicleId}`)

// Fetch related vehicles
const { data: relatedVehicles } = await useFetch(`/api/vehicles/${vehicleId}/related`, {
  default: () => []
})

// Fetch car market data for price comparison and chart
const { data: carData } = await useFetch('/api/cars', {
  query: {
    slug: computed(() => {
      if (!vehicle.value) return ''
      // Create slug from vehicle data
      return `${vehicle.value.brand.toLowerCase()}-${vehicle.value.model.toLowerCase()}-${vehicle.value.year}`
        .replace(/\s+/g, '-')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    })
  },
  default: () => null,
  server: false // Only fetch on client side since it depends on vehicle data
})

// Reactive data for financing simulator
const showFinancial = ref(false)

// Computed properties for price chart
const priceLabels = computed(() => {
  if (!carData.value?.prices?.length) return []
  return carData.value.prices.map((item: any) => {
    const date = new Date(item.referenceDate + 'T03:00:00')
    return `${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
  }).reverse()
})

const priceDatasets = computed(() => {
  if (!carData.value?.prices?.length) return []
  return [{
    label: 'Preço de Mercado (R$)',
    data: carData.value.prices.map((item: any) => item.value).reverse(),
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 1)',
    pointStyle: 'circle',
    pointRadius: 4,
    pointHoverRadius: 6,
    fill: true,
  }]
})

// Price comparison logic
const averageMarketPrice = computed(() => {
  if (!carData.value?.partners?.length) return 0
  const total = carData.value.partners.reduce((sum: number, partner: any) => sum + partner.value, 0)
  return Math.round(total / carData.value.partners.length)
})

const priceComparison = computed(() => {
  if (!vehicle.value || !carData.value?.partners?.length) return null
  
  const vehiclePrice = vehicle.value.price
  const marketAverage = averageMarketPrice.value
  const difference = vehiclePrice - marketAverage
  const percentageDiff = Math.abs(difference / marketAverage * 100)
  
  if (difference < -2000) { // R$ 2.000 below average
    return {
      isGoodDeal: true,
      isExpensive: false,
      message: `R$ ${Math.abs(difference).toLocaleString('pt-BR')} abaixo da média`,
    }
  } else if (difference > 3000) { // R$ 3.000 above average
    return {
      isGoodDeal: false,
      isExpensive: true,
      message: `R$ ${difference.toLocaleString('pt-BR')} acima da média`,
    }
  } else {
    return {
      isGoodDeal: false,
      isExpensive: false,
      message: 'Preço próximo à média de mercado',
    }
  }
})


// Formatting methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Meta tags
useHead({
  title: computed(() => vehicle.value ? `${vehicle.value.title} - Auto URBAN` : 'Carregando...'),
  meta: [
    {
      name: 'description',
      content: computed(() => vehicle.value 
        ? `${vehicle.value.title} por ${formatCurrency(vehicle.value.price)} em ${vehicle.value.city}, ${vehicle.value.uf}. ${vehicle.value.km.toLocaleString('pt-BR')} km rodados.`
        : 'Carregando detalhes do veículo...'
      )
    },
    {
      property: 'og:title',
      content: computed(() => vehicle.value ? `${vehicle.value.title} - Auto URBAN` : 'Auto URBAN')
    },
    {
      property: 'og:description', 
      content: computed(() => vehicle.value
        ? `${formatCurrency(vehicle.value.price)} • ${vehicle.value.km.toLocaleString('pt-BR')} km • ${vehicle.value.city}, ${vehicle.value.uf}`
        : 'Marketplace de carros'
      )
    },
    {
      property: 'og:image',
      content: computed(() => vehicle.value?.coverImageUrl || '/imgs/Logo.svg')
    },
    {
      property: 'og:type',
      content: 'product'
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image'
    }
  ]
})
</script>