<template>
  <NuxtLink 
    :to="`/carro/${vehicle.id}`"
    class="block bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 cursor-pointer group"
  >
    <!-- Image -->
    <div class="relative aspect-[4/3] rounded-t-lg overflow-hidden">
      <img 
        :src="vehicle.coverImageUrl || '/imgs/search-example.jpg'" 
        :alt="vehicle.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        loading="lazy"
      >
      <!-- Status badge -->
      <div class="absolute top-3 right-3">
        <UiBadge 
          v-if="vehicle.status === 'PENDING'"
          color="yellow" 
          variant="solid"
          size="xs"
        >
          Aguardando
        </UiBadge>
        <UiBadge 
          v-else-if="vehicle.status === 'APPROVED'"
          color="green" 
          variant="solid"
          size="xs"
        >
          <Icon name="mdi:check-bold" class="w-4 h-4" />
        </UiBadge>
        <UiBadge 
          v-else
          color="red" 
          variant="solid"
          size="xs"
        >
          Rejeitado
        </UiBadge>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {{ vehicle.title }}
      </h3>

      <!-- Details -->
      <div class="space-y-2 mb-4">
        <div class="flex justify-between text-sm text-gray-600">
          <span>{{ vehicle.year }}</span>
          <span>{{ formatKm(vehicle.km) }}</span>
        </div>
        
        <div class="flex justify-between text-sm text-gray-600">
          <span>{{ vehicle.brand }}</span>
          <span>{{ vehicle.city }}/{{ vehicle.uf }}</span>
        </div>
      </div>

      <!-- Price -->
      <div class="flex justify-between items-end">
        <div>
          <p class="text-2xl font-bold text-green-600">
            {{ formatCurrency(vehicle.price) }}
          </p>
        </div>
        
        <Icon 
          name="heroicons:arrow-right-20-solid" 
          class="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all"
        />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
interface VehicleProps {
  vehicle: {
    id: string
    title: string
    brand: string
    model: string
    year: number
    price: number
    km: number
    city: string
    uf: string
    coverImageUrl?: string
    status: 'PENDING' | 'APPROVED' | 'REJECTED'
  }
}

const props = defineProps<VehicleProps>()

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