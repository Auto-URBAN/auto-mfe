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
    <div class="flex flex-col p-2 gap-2" id="vehicle-card-content">
      <div class="flex gap-2 items-center">
        <div>
          <img 
              :src="brandsData.find(combo => combo.name === vehicle.brand)?.logo || '/logos/default-car-logo.webp'" 
              :alt="brandsData.find(combo => combo.name === vehicle.brand)?.name || 'Marca Desconhecida'"
              class="w-8 h-8 object-contain"
            />
        </div>
        <div class="flex-1">
        <h3 class="font-semibold text-gray-900 text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
          {{ vehicle.title }}
        </h3>

        <div>
          <span class="text-xl font-bold text-green-600">
            {{ formatCurrency(vehicle.price) }}
          </span>
        </div>

        </div>
      </div>
      <hr>
    <div class="flex flex-wrap gap-2">
      <UiBadge color="gray" variant="soft" size="sm">
        {{ vehicle.year }}
      </UiBadge>
      <UiBadge color="gray" variant="soft" size="sm">
        {{ formatKm(vehicle.km) }}
      </UiBadge>
      <UiBadge color="blue" variant="soft" size="sm">
        {{ vehicle.uf }}
      </UiBadge>
      <UiBadge color="red" variant="soft" size="sm">
        {{ vehicle.horsepower }} HP
      </UiBadge>
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

const brandsData = [
        {
            name: 'Audi',
            logo: '/logos/audi.webp',
        },
        {
            name: 'BMW',
            logo: '/logos/bmw.webp',
        },
        {
            name: 'Chevrolet',
            logo: '/logos/chevrolet.webp',
        },
        {
            name: 'Ford',
            logo: '/logos/ford.webp'
        },
        {
            name: 'Honda',
            logo: '/logos/honda.webp',
        },
        {
            name: 'Hyundai',
            logo: '/logos/hyundai.webp',
        },
        {
            name: 'Mercedes',
            logo: '/logos/mercedes-benz.webp',
        },
        {
            name: 'Nissan',
            logo: '/logos/nissan.webp',
        },
        {
            name: 'Porsche',
            logo: '/logos/porsche.webp',
        },
        {
            name: 'Renault',
            logo: '/logos/renault.webp',
        },
        {
            name: 'Toyota',
            logo: '/logos/toyota.webp',
        },
        {
            name: 'Volkswagen',
            logo: '/logos/volkswagen.webp',
        }
    ]
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