<template>
  <UiCard>
    <template #header>
      <h3 class="text-lg font-semibold text-gray-900">
        Especificações
      </h3>
    </template>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Basic Info -->
      <div class="space-y-3">
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Marca</span>
          <span class="text-sm font-medium text-gray-900">{{ vehicle.brand }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Modelo</span>
          <span class="text-sm font-medium text-gray-900">{{ vehicle.model }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Ano</span>
          <span class="text-sm font-medium text-gray-900">{{ vehicle.year }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Quilometragem</span>
          <span class="text-sm font-medium text-gray-900">{{ formatKm(vehicle.km) }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Localização</span>
          <span class="text-sm font-medium text-gray-900">{{ vehicle.city }}, {{ vehicle.uf }}</span>
        </div>
      </div>

      <!-- Additional Specs -->
      <div class="space-y-3">
        <div v-if="vehicle.gearbox" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Câmbio</span>
          <span class="text-sm font-medium text-gray-900">{{ formatGearbox(vehicle.gearbox) }}</span>
        </div>
        
        <div v-if="vehicle.fuel" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Combustível</span>
          <span class="text-sm font-medium text-gray-900">{{ formatFuel(vehicle.fuel) }}</span>
        </div>
        
        <div v-if="vehicle.color" class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Cor</span>
          <span class="text-sm font-medium text-gray-900">{{ vehicle.color }}</span>
        </div>
        
        <div class="flex justify-between py-2 border-b border-gray-100">
          <span class="text-sm text-gray-600">Status</span>
          <StatusBadge :status="vehicle.status" />
        </div>

        <div class="flex justify-between py-2">
          <span class="text-sm text-gray-600">Anúncio ID</span>
          <span class="text-sm font-medium text-gray-900 font-mono">#{{ vehicle.id.substring(0, 8) }}</span>
        </div>
      </div>
    </div>

    <!-- Description -->
    <div v-if="vehicle.description" class="mt-6 pt-6 border-t border-gray-100">
      <h4 class="text-md font-semibold text-gray-900 mb-3">Descrição</h4>
      <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
        {{ vehicle.description }}
      </p>
    </div>

    <!-- Price Highlight -->
    <div class="mt-6 pt-6 border-t border-gray-100">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-600">Preço anunciado</p>
          <p class="text-2xl font-bold text-green-600">
            {{ formatCurrency(vehicle.price) }}
          </p>
        </div>
        
        <div class="text-right">
          <p class="text-xs text-gray-500 mb-1">Publicado em</p>
          <p class="text-sm text-gray-700">{{ formatDate(vehicle.createdAt) }}</p>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import StatusBadge from './StatusBadge.vue'
import type { VehicleStatus } from '~/schemas/vehicle'

interface VehicleDetail {
  id: string
  brand: string
  model: string
  year: number
  km: number
  city: string
  uf: string
  price: number
  status: VehicleStatus
  createdAt: string
  description?: string
  gearbox?: 'MANUAL' | 'AUTO'
  fuel?: 'GASOLINA' | 'ALCOOL' | 'DIESEL' | 'HIBRIDO' | 'ELETRICO'
  color?: string
}

interface Props {
  vehicle: VehicleDetail
}

defineProps<Props>()

// Formatting methods
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatKm = (km: number) => {
  return `${km.toLocaleString('pt-BR')} km`
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  }).format(new Date(date))
}

const formatGearbox = (gearbox: string) => {
  const types = {
    'MANUAL': 'Manual',
    'AUTO': 'Automático'
  }
  return types[gearbox as keyof typeof types] || gearbox
}

const formatFuel = (fuel: string) => {
  const fuels = {
    'GASOLINA': 'Gasolina',
    'ALCOOL': 'Álcool',
    'DIESEL': 'Diesel',
    'HIBRIDO': 'Híbrido',
    'ELETRICO': 'Elétrico'
  }
  return fuels[fuel as keyof typeof fuels] || fuel
}
</script>