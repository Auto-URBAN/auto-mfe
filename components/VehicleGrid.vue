<template>
  <div class="w-full">
    <!-- Loading skeleton -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="n in skeletonCount" 
        :key="n"
        class="bg-white rounded-lg border animate-pulse"
      >
        <div class="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
        <div class="p-4 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-3/4"></div>
          <div class="h-6 bg-gray-200 rounded w-1/2"></div>
          <div class="flex gap-2">
            <div class="h-5 bg-gray-200 rounded w-16"></div>
            <div class="h-5 bg-gray-200 rounded w-20"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-2/3"></div>
          <div class="h-8 bg-gray-200 rounded"></div>
        </div>
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
      <UIcon name="i-heroicons-magnifying-glass" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
      <p class="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
      <UButton @click="$emit('clearFilters')" color="primary" variant="outline">
        Limpar filtros
      </UButton>
    </div>

    <!-- Load more button -->
    <div v-if="!loading && vehicles.length > 0 && hasMore" class="text-center mt-8">
      <UButton 
        @click="$emit('loadMore')"
        :loading="loadingMore"
        color="primary" 
        variant="outline"
        size="lg"
      >
        Carregar mais veículos
      </UButton>
    </div>

    <!-- Results counter -->
    <div v-if="!loading && vehicles.length > 0" class="text-center mt-6 text-sm text-gray-500">
      Exibindo {{ vehicles.length }} de {{ totalResults }} veículos
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'

interface Props {
  vehicles: VehicleSummary[]
  loading?: boolean
  loadingMore?: boolean
  hasMore?: boolean
  totalResults?: number
  skeletonCount?: number
}

interface Emits {
  loadMore: []
  clearFilters: []
}

withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  hasMore: false,
  totalResults: 0,
  skeletonCount: 8
})

defineEmits<Emits>()
</script>