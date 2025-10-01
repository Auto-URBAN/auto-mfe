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
      </div>
    </div>

    <!-- Content -->
    <div class="p-5">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 text-base line-clamp-2 mb-3 group-hover:text-blue-600 transition-colors">
        {{ vehicle.title }}
      </h3>

      <!-- Price -->
      <div class="mb-4">
        <span class="text-2xl font-bold text-green-600">
          {{ formatCurrency(vehicle.price) }}
        </span>
      </div>

      <!-- Vehicle info -->
      <div class="flex flex-wrap gap-2 mb-4">
        <UiBadge color="gray" variant="soft" size="sm">
          {{ vehicle.year }}
        </UiBadge>
        <UiBadge color="gray" variant="soft" size="sm">
          {{ formatKm(vehicle.km) }}
        </UiBadge>
        <UiBadge color="blue" variant="soft" size="sm">
          {{ vehicle.uf }}
        </UiBadge>
      </div>

      <!-- Location -->
      <p class="text-sm text-gray-600 mb-5">
        <Icon name="heroicons:map-pin-20-solid" class="w-4 h-4 inline mr-1" />
        {{ vehicle.city }}, {{ vehicle.uf }}
      </p>

      <!-- CTA Button -->
      <div class="flex items-center justify-between">
        <span class="text-blue-600 font-medium group-hover:text-blue-700">
          Ver Detalhes
        </span>
        <Icon name="heroicons:arrow-right-20-solid" class="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'

interface Props {
  vehicle: VehicleSummary
}

defineProps<Props>()

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