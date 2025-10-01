<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-4 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:funnel-20-solid" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Filtros</h3>
        </div>
        <UiButton 
          v-if="hasActiveFilters"
          @click="clearAllFilters" 
          variant="ghost" 
          size="sm"
          class="text-white hover:bg-white/20 border-white/30 text-sm"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-1" />
          Limpar
        </UiButton>
      </div>
      
      <!-- Active filters count -->
      <div v-if="hasActiveFilters" class="mt-2">
        <div class="inline-flex items-center px-2 py-1 bg-white/20 rounded-full">
          <Icon name="heroicons:check-circle-20-solid" class="w-3 h-3 text-white mr-1" />
          <span class="text-xs text-white font-medium">{{ activeFiltersCount }} filtro{{ activeFiltersCount > 1 ? 's' : '' }} ativo{{ activeFiltersCount > 1 ? 's' : '' }}</span>
        </div>
      </div>
    </div>

    <!-- Filters Content -->
    <div class="p-4 space-y-5 max-h-[calc(100vh-200px)] overflow-y-auto">
      <!-- Sort -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:arrows-up-down-20-solid" class="w-3 h-3 text-blue-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Ordenar por</label>
        </div>
        <UiSelect
          v-model="localFilters.sort"
          :options="filterOptions.sortOptions"
          placeholder="Selecione"
          size="sm"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Brand -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-green-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:building-office-20-solid" class="w-3 h-3 text-green-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Marca</label>
        </div>
        <UiSelect
          v-model="localFilters.make"
          :options="brandOptions"
          placeholder="Todas as marcas"
          size="sm"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Model -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:tag-20-solid" class="w-3 h-3 text-purple-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Modelo</label>
        </div>
        <UiSelect
          v-model="localFilters.model"
          :options="modelOptions"
          placeholder="Todos os modelos"
          size="sm"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Year Range -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-orange-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:calendar-days-20-solid" class="w-3 h-3 text-orange-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Ano</label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UiSelect
            v-model="localFilters.yearMin"
            :options="yearOptions"
            placeholder="Ano mín."
            size="sm"
            @update:model-value="updateFilters"
          />
          <UiSelect
            v-model="localFilters.yearMax"
            :options="yearOptions"
            placeholder="Ano máx."
            size="sm"
            @update:model-value="updateFilters"
          />
        </div>
      </div>

      <!-- Price Range -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:currency-dollar-20-solid" class="w-3 h-3 text-emerald-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Faixa de Preço</label>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div 
            v-for="range in filterOptions.priceRanges" 
            :key="range.value"
            class="flex items-center"
          >
            <input
              :id="`price-${range.value}`"
              v-model="localFilters.priceRange"
              :value="range.value"
              type="radio"
              name="priceRange"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
              @change="updateFilters"
            />
            <label 
              :for="`price-${range.value}`"
              class="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
            >
              {{ range.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Custom Price Range -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:calculator-20-solid" class="w-3 h-3 text-emerald-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Preço Personalizado</label>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <UiInput
            v-model="localFilters.priceMin"
            type="number"
            placeholder="Preço mín."
            size="sm"
            icon-left="heroicons:currency-dollar-20-solid"
            @input="handleCustomPrice"
          />
          <UiInput
            v-model="localFilters.priceMax"
            type="number"
            placeholder="Preço máx."
            size="sm"
            icon-left="heroicons:currency-dollar-20-solid"
            @input="handleCustomPrice"
          />
        </div>
      </div>

            <!-- KM Range -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:map-20-solid" class="w-3 h-3 text-indigo-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Quilometragem</label>
        </div>
        <div class="bg-gray-50 rounded-lg p-3 space-y-2">
          <div 
            v-for="range in filterOptions.kmRanges" 
            :key="range.value"
            class="flex items-center"
          >
            <input
              :id="`km-${range.value}`"
              v-model="localFilters.kmRange"
              :value="range.value"
              type="radio"
              name="kmRange"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              @change="updateFilters"
            />
            <label 
              :for="`km-${range.value}`"
              class="ml-2 text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors"
            >
              {{ range.label }}
            </label>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-red-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:map-pin-20-solid" class="w-3 h-3 text-red-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Estado</label>
        </div>
        <UiSelect
          v-model="localFilters.uf"
          :options="locationOptions"
          placeholder="Todos os estados"
          size="sm"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Color -->
      <div class="space-y-2">
        <div class="flex items-center space-x-2 mb-2">
          <div class="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center">
            <Icon name="heroicons:swatch-20-solid" class="w-3 h-3 text-pink-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Cor</label>
        </div>
        <UiSelect
          v-model="localFilters.color"
          :options="colorOptions"
          placeholder="Todas as cores"
          size="sm"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Location -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Estado</label>
        <UiSelect
          v-model="localFilters.uf"
          :options="locationOptions"
          placeholder="Todos os estados"
          @update:model-value="updateFilters"
        />
      </div>

      <!-- Color -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-700">Cor</label>
        <UiSelect
          v-model="localFilters.color"
          :options="colorOptions"
          placeholder="Todas as cores"
          @update:model-value="updateFilters"
        />
      </div>
    </div>

    <!-- Apply Filters Button (Mobile) -->
    <div class="p-4 border-t border-gray-200 lg:hidden bg-gradient-to-r from-blue-50 to-purple-50">
      <UiButton @click="$emit('close')" class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium">
        <Icon name="heroicons:check-20-solid" class="w-4 h-4 mr-2" />
        Aplicar Filtros
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface FilterOptions {
  brands: string[]
  models: string[]
  colors: string[]
  states: { value: string; label: string }[]
  years: number[]
  sortOptions: { value: string; label: string }[]
  priceRanges: { value: string; label: string }[]
  kmRanges: { value: string; label: string }[]
}

interface Filters {
  sort?: string
  make?: string
  model?: string
  yearMin?: string
  yearMax?: string
  priceMin?: string
  priceMax?: string
  priceRange?: string
  kmRange?: string
  kmMin?: string
  kmMax?: string
  uf?: string
  color?: string
}

interface Props {
  filters: Filters
  loading?: boolean
}

interface Emits {
  (e: 'update:filters', filters: Filters): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Local filters state
const localFilters = ref<Filters>({ ...props.filters })

// Filter options from API
const filterOptions = await $fetch<FilterOptions>('/api/cars/filters')

// Watch for prop changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Computed options
const brandOptions = computed(() => [
  { value: '', label: 'Todas as marcas' },
  ...filterOptions.brands.map((brand: string) => ({ value: brand, label: brand }))
])

const modelOptions = computed(() => [
  { value: '', label: 'Todos os modelos' },
  ...filterOptions.models.map((model: string) => ({ value: model, label: model }))
])

const yearOptions = computed(() => [
  { value: '', label: 'Qualquer ano' },
  ...filterOptions.years.map((year: number) => ({ value: year.toString(), label: year.toString() }))
])

const locationOptions = computed(() => [
  { value: '', label: 'Todos os estados' },
  ...filterOptions.states
])

const colorOptions = computed(() => [
  { value: '', label: 'Todas as cores' },
  ...filterOptions.colors.map((color: string) => ({ value: color, label: color }))
])

// Check if any filters are active
const hasActiveFilters = computed(() => {
  return Object.keys(localFilters.value).some(key => {
    const value = localFilters.value[key as keyof Filters]
    return value && value !== '' && key !== 'sort'
  })
})

// Count active filters
const activeFiltersCount = computed(() => {
  return Object.keys(localFilters.value).filter(key => {
    const value = localFilters.value[key as keyof Filters]
    return value && value !== '' && key !== 'sort'
  }).length
})

// Handle custom price input
const handleCustomPrice = () => {
  // Clear price range when custom price is entered
  if (localFilters.value.priceMin || localFilters.value.priceMax) {
    localFilters.value.priceRange = ''
  }
  updateFilters()
}

// Update filters
const updateFilters = () => {
  // Handle price range selection
  if (localFilters.value.priceRange) {
    const [min, max] = localFilters.value.priceRange.split('-')
    localFilters.value.priceMin = min
    localFilters.value.priceMax = max === '999999999' ? '' : max
  }

  // Handle KM range selection
  if (localFilters.value.kmRange) {
    const [min, max] = localFilters.value.kmRange.split('-')
    localFilters.value.kmMin = min
    localFilters.value.kmMax = max === '999999999' ? '' : max
  }

  emit('update:filters', { ...localFilters.value })
}

// Clear all filters
const clearAllFilters = () => {
  localFilters.value = { sort: localFilters.value.sort || 'recent' }
  updateFilters()
}
</script>