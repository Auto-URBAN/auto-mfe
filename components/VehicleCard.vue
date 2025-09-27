<template>
  <NuxtLink 
    :to="`/vehicle/${vehicle.id}`"
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
        <UBadge 
          v-if="vehicle.status === 'PENDING'"
          color="yellow" 
          variant="solid"
          size="xs"
        >
          Aguardando
        </UBadge>
        <UBadge 
          v-else-if="vehicle.status === 'APPROVED'"
          color="green" 
          variant="solid"
          size="xs"
        >
          Aprovado
        </UBadge>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
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
        <UBadge color="gray" variant="soft" size="xs">
          {{ vehicle.year }}
        </UBadge>
        <UBadge color="gray" variant="soft" size="xs">
          {{ formatKm(vehicle.km) }}
        </UBadge>
        <UBadge color="blue" variant="soft" size="xs">
          {{ vehicle.uf }}
        </UBadge>
      </div>

      <!-- Location -->
      <p class="text-sm text-gray-600 mb-4">
        <UIcon name="i-heroicons-map-pin" class="w-4 h-4 inline mr-1" />
        {{ vehicle.city }}, {{ vehicle.uf }}
      </p>

      <!-- CTA Button -->
      <div class="flex items-center justify-between text-sm">
        <span class="text-blue-600 font-medium group-hover:text-blue-700">
          Ver Detalhes
        </span>
        <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
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