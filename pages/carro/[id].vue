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
        <!-- Left Column: Gallery + Specs -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Image Gallery -->
          <VehicleGallery :vehicle="vehicle" />

          <!-- Specifications -->
          <VehicleSpecs :vehicle="vehicle" />
        </div>

        <!-- Right Column: Contact -->
        <div class="lg:col-span-1">
          <VehicleContact 
            :vehicle="vehicle" 
            :seller="vehicle.seller" 
          />
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