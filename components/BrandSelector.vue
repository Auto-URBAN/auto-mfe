<template>
  <div class="space-y-3">
    <div class="flex items-center space-x-2">
      <div class="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
        <Icon name="heroicons:building-office-20-solid" class="w-3 h-3 text-green-600" />
      </div>
      <label class="text-sm font-medium text-gray-800">Marcas</label>
      <span v-if="selectedCount > 0" class="text-xs text-green-600 font-medium">
        ({{ selectedCount }} selecionada{{ selectedCount > 1 ? 's' : '' }})
      </span>
    </div>

    <!-- Search Input -->
    <div v-if="searchable" class="relative">
      <UiInput
        v-model="searchQuery"
        placeholder="Buscar marca..."
        size="sm"
        icon-left="heroicons:magnifying-glass-20-solid"
        class="w-full"
      />
    </div>

    <!-- Selected Brands (Chips) -->
    <div v-if="selectedBrands.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="brand in selectedBrands"
        :key="brand.id"
        class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
      >
        <img 
          :src="brand.logo" 
          :alt="brand.name"
          class="w-4 h-4 object-contain"
          loading="lazy"
        />
        <span>{{ brand.name }}</span>
        <span class="text-xs opacity-75">({{ brand.count }})</span>
        <button
          @click="removeBrand(brand.id)"
          class="hover:bg-green-200 rounded-full p-0.5 transition-colors"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Brands Grid -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
      <button
        v-for="brand in filteredBrands"
        :key="brand.id"
        @click="toggleBrand(brand.id)"
        :class="[
          'group relative p-4 border-2 rounded-lg transition-all duration-200',
          'hover:shadow-md hover:scale-[1.02] hover:border-green-300',
          'focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
          isSelected(brand.id)
            ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-offset-2'
            : 'border-gray-200 bg-white hover:bg-gray-50',
          brand.count === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]"
        :disabled="brand.count === 0"
      >
        <!-- Selected Indicator -->
        <div
          v-if="isSelected(brand.id)"
          class="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md"
        >
          <Icon name="heroicons:check-20-solid" class="w-4 h-4 text-white" />
        </div>

        <!-- Brand Logo -->
        <div class="flex flex-col items-center space-y-2">
          <div class="w-12 h-12 flex items-center justify-center bg-gray-50 rounded-lg group-hover:bg-white transition-colors">
            <img 
              :src="brand.logo" 
              :alt="brand.name"
              class="w-10 h-10 object-contain filter group-hover:brightness-110 transition-all"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
          <div class="text-center">
            <div class="text-sm font-medium text-gray-900 group-hover:text-green-700 transition-colors">
              {{ brand.name }}
            </div>
            <div class="text-xs text-gray-500">
              {{ brand.count }} veículo{{ brand.count !== 1 ? 's' : '' }}
            </div>
          </div>
        </div>

        <!-- Hover Effect -->
        <div 
          class="absolute inset-0 rounded-lg bg-gradient-to-br from-green-400/10 to-blue-400/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        />
      </button>
    </div>

    <!-- No Results -->
    <div v-if="searchQuery && filteredBrands.length === 0" class="text-center py-6">
      <Icon name="heroicons:magnifying-glass-20-solid" class="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p class="text-sm text-gray-500">Nenhuma marca encontrada</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Brand } from '~/schemas/filters'

interface Props {
  brands: Brand[]
  modelValue: string[]
  searchable?: boolean
  maxSelection?: number
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
  (e: 'change', selectedBrands: Brand[]): void
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  maxSelection: 10
})

const emit = defineEmits<Emits>()

// Search functionality
const searchQuery = ref('')

// Computed properties
const selectedBrands = computed(() => 
  props.brands.filter(brand => props.modelValue.includes(brand.id))
)

const selectedCount = computed(() => props.modelValue.length)

const filteredBrands = computed(() => {
  let brands = props.brands
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    brands = brands.filter(brand => 
      brand.name.toLowerCase().includes(query)
    )
  }
  
  return brands.sort((a, b) => {
    // Selected brands first
    const aSelected = props.modelValue.includes(a.id)
    const bSelected = props.modelValue.includes(b.id)
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    
    // Then by count (desc)
    if (a.count !== b.count) return b.count - a.count
    
    // Then alphabetically
    return a.name.localeCompare(b.name)
  })
})

// Methods
const isSelected = (brandId: string): boolean => {
  return props.modelValue.includes(brandId)
}

const toggleBrand = (brandId: string) => {
  const brand = props.brands.find(b => b.id === brandId)
  if (!brand || brand.count === 0) return

  let newSelection = [...props.modelValue]
  
  if (isSelected(brandId)) {
    // Remove brand
    newSelection = newSelection.filter(id => id !== brandId)
  } else {
    // Add brand (check max selection)
    if (props.maxSelection && newSelection.length >= props.maxSelection) {
      return
    }
    newSelection.push(brandId)
  }
  
  emit('update:modelValue', newSelection)
  emit('change', props.brands.filter(b => newSelection.includes(b.id)))
}

const removeBrand = (brandId: string) => {
  const newSelection = props.modelValue.filter(id => id !== brandId)
  emit('update:modelValue', newSelection)
  emit('change', props.brands.filter(b => newSelection.includes(b.id)))
}

const handleImageError = (event: Event) => {
  // Fallback for missing images
  const img = event.target as HTMLImageElement
  img.src = '/imgs/Logo.svg' // Fallback to app logo
}
</script>