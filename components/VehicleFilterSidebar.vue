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
          <span class="text-xs text-white font-medium">
            {{ activeFiltersCount }} filtro{{ activeFiltersCount > 1 ? 's' : '' }} ativo{{ activeFiltersCount > 1 ? 's' : '' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <div class="space-y-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div class="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <UiAlert variant="error" :title="error">
        <UiButton @click="loadFilterOptions" variant="outline" size="sm">
          Tentar novamente
        </UiButton>
      </UiAlert>
    </div>

    <!-- Filters Content -->
    <div v-else-if="filterOptions" class="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
      
      <!-- Sort -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:arrows-up-down-20-solid" class="w-3 h-3 text-blue-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Ordenar por</label>
        </div>
        <UiSelect
          :model-value="filters.sort"
          :options="filterOptions.sortOptions"
          placeholder="Ordenar por"
          label="value"
          track-by="key"
          @update:model-value="updateSort"
        />
      </div>

      <!-- Brands -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:building-office-2-20-solid" class="w-3 h-3 text-green-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Marcas</label>
        </div>
        
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <div 
              v-for="brand in filterOptions.brands" 
              :key="brand.id"
              @click="toggleBrand(brand.id)"
              class="p-3 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md relative"
              :class="filters.brands.includes(brand.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'"
            >
                <div class="flex flex-col items-center justify-center">
                  <div class="flex h-10 mb-2">
                    <img 
                    :src="brand.logo" 
                    :alt="brand.name"
                    class="object-contain"
                    @error="onImageError"
                  />
                  </div>
                  <span class="text-sm font-medium">{{ brand.name }} </span>
                </div>
              <span class="absolute right-2 top-2 text-xs text-white bg-slate-400 rounded-full px-1">{{ brand.count }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Models -->
      <div v-if="availableModels.length > 0" class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:tag-20-solid" class="w-3 h-3 text-purple-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Modelos</label>
        </div>
        
        <div class="space-y-2 max-h-48 overflow-y-auto">
          <div 
            v-for="model in availableModels" 
            :key="model.id"
            @click="toggleModel(model.id)"
            class="flex items-center justify-between p-2 border rounded cursor-pointer transition-all duration-200"
            :class="filters.models.includes(model.id) ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <span class="text-sm">{{ model.name }}</span>
            <span class="text-xs text-gray-500">{{ model.count }}</span>
          </div>
        </div>
      </div>

      <!-- Years -->
      <div v-if="availableYears.length > 0" class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:calendar-days-20-solid" class="w-3 h-3 text-orange-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Anos</label>
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <div 
            v-for="year in availableYears" 
            :key="year"
            @click="toggleYear(year)"
            class="p-1 text-center border rounded cursor-pointer transition-all duration-200"
            :class="filters.years.includes(year) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <span class="text-sm font-medium">{{ year }}</span>
          </div>
        </div>
      </div>

      <!-- Colors -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:swatch-20-solid" class="w-3 h-3 text-pink-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Cores</label>
        </div>
        
        <div class="grid grid-cols-3 gap-2">
          <div 
            v-for="color in filterOptions.colors" 
            :key="color.id"
            @click="toggleColor(color.id)"
            class="flex flex-col items-center p-2 border rounded cursor-pointer transition-all duration-200"
            :class="filters.colors.includes(color.id) ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div 
              class="w-6 h-6 rounded-full border-2 border-neutral-500 shadow-sm mb-1"
              :style="{ backgroundColor: color.hex }"
            ></div>
            <span class="text-xs">{{ color.name }}</span>
          </div>
        </div>
      </div>

      <!-- Price Range -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:currency-dollar-20-solid" class="w-3 h-3 text-red-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Faixa de Preço</label>
        </div>
        
        <div class="grid grid-cols-2 gap-2">
          <div 
            v-for="range in filterOptions.priceRanges" 
            :key="`${range.min}-${range.max}`"
            @click="selectPriceRange(range)"
            class="p-2 text-center border rounded cursor-pointer transition-all duration-200 text-sm"
            :class="isPriceRangeSelected(range) ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'"
          >
            {{ formatPriceRange(range) }}
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import type { FiltersV2, FiltersOptionsV2 } from '~/schemas/filters'

interface Props {
  loading?: boolean
}

interface Emits {
  (e: 'update:filters', filters: any): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// Estado local
const filters = ref<FiltersV2>({
  brands: [],
  models: [],
  years: [],
  colors: [],
  states: [],
  priceRange: undefined,
  kmRange: undefined,
  sort: 'recent'
})

const filterOptions = ref<FiltersOptionsV2 | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.brands.length > 0 ||
         filters.value.models.length > 0 ||
         filters.value.years.length > 0 ||
         filters.value.colors.length > 0 ||
         filters.value.states.length > 0 ||
         filters.value.priceRange ||
         filters.value.kmRange
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.brands.length > 0) count++
  if (filters.value.models.length > 0) count++
  if (filters.value.years.length > 0) count++
  if (filters.value.colors.length > 0) count++
  if (filters.value.states.length > 0) count++
  if (filters.value.priceRange) count++
  if (filters.value.kmRange) count++
  return count
})

const availableModels = computed(() => {
  if (!filterOptions.value) return []
  
  if (filters.value.brands.length === 0) {
    return filterOptions.value.models
  }
  
  return filterOptions.value.models.filter(model => 
    filters.value.brands.includes(model.brandId)
  )
})

const availableYears = computed(() => {
  if (!filterOptions.value) return []
  
  let years = new Set<number>()
  
  if (filters.value.brands.length === 0 && filters.value.models.length === 0) {
    filterOptions.value.years.forEach(year => years.add(year))
  } else if (filters.value.models.length > 0) {
    const selectedModels = filterOptions.value.models.filter(model => 
      filters.value.models.includes(model.id)
    )
    selectedModels.forEach(model => {
      model.years.forEach(year => years.add(year))
    })
  } else if (filters.value.brands.length > 0) {
    const brandsYears = filterOptions.value.brands.filter(brand => 
      filters.value.brands.includes(brand.id)
    )
    brandsYears.forEach(brand => {
      brand.years.forEach(year => years.add(year))
    })
  }
  
  return Array.from(years).sort((a, b) => b - a)
})

// Methods
const loadFilterOptions = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch<FiltersOptionsV2>('/api/cars/filters-v2')
    filterOptions.value = response
  } catch (err) {
    error.value = 'Erro ao carregar opções de filtros'
    console.error('Error loading filter options:', err)
  } finally {
    loading.value = false
  }
}

const updateSort = (sort: string) => {
  filters.value.sort = sort
  emitFilters()
}

const toggleBrand = (brandId: string) => {
  const index = filters.value.brands.indexOf(brandId)
  if (index > -1) {
    filters.value.brands.splice(index, 1)
  } else {
    filters.value.brands.push(brandId)
  }
  
  // Limpar modelos se a marca não estiver mais selecionada
  if (index > -1) {
    const availableModelIds = availableModels.value.map(m => m.id)
    filters.value.models = filters.value.models.filter(modelId => 
      availableModelIds.includes(modelId)
    )
  }
  
  emitFilters()
}

const toggleModel = (modelId: string) => {
  const index = filters.value.models.indexOf(modelId)
  if (index > -1) {
    filters.value.models.splice(index, 1)
  } else {
    filters.value.models.push(modelId)
  }
  emitFilters()
}

const toggleYear = (year: number) => {
  const index = filters.value.years.indexOf(year)
  if (index > -1) {
    filters.value.years.splice(index, 1)
  } else {
    filters.value.years.push(year)
  }
  emitFilters()
}

const toggleColor = (colorId: string) => {
  const index = filters.value.colors.indexOf(colorId)
  if (index > -1) {
    filters.value.colors.splice(index, 1)
  } else {
    filters.value.colors.push(colorId)
  }
  emitFilters()
}

const selectPriceRange = (range: any) => {
  filters.value.priceRange = {
    min: range.min,
    max: range.max === 999999999 ? undefined : range.max
  }
  emitFilters()
}

const isPriceRangeSelected = (range: any): boolean => {
  const current = filters.value.priceRange
  return current?.min === range.min && current?.max === (range.max === 999999999 ? undefined : range.max)
}

const formatPriceRange = (range: any): string => {
  if (range.max === 999999999) {
    return `Acima de R$ ${(range.min / 1000).toFixed(0)}k`
  }
  return `R$ ${(range.min / 1000).toFixed(0)}k - R$ ${(range.max / 1000).toFixed(0)}k`
}

const clearAllFilters = () => {
  filters.value = {
    brands: [],
    models: [],
    years: [],
    colors: [],
    states: [],
    priceRange: undefined,
    kmRange: undefined,
    sort: 'recent'
  }
  emitFilters()
}

const emitFilters = () => {
  // Converter para formato compatível com a API existente
  const queryParams: any = {
    sort: filters.value.sort
  }
  
  if (filters.value.brands.length > 0) {
    queryParams.make = filters.value.brands[0] // Por enquanto, apenas a primeira marca
  }
  
  if (filters.value.models.length > 0) {
    queryParams.model = filters.value.models[0] // Por enquanto, apenas o primeiro modelo
  }
  
  if (filters.value.years.length > 0) {
    const sortedYears = [...filters.value.years].sort()
    queryParams.yearMin = sortedYears[0].toString()
    queryParams.yearMax = sortedYears[sortedYears.length - 1].toString()
  }
  
  if (filters.value.colors.length > 0) {
    queryParams.color = filters.value.colors[0] // Por enquanto, apenas a primeira cor
  }
  
  if (filters.value.priceRange) {
    if (filters.value.priceRange.min) {
      queryParams.priceMin = filters.value.priceRange.min.toString()
    }
    if (filters.value.priceRange.max) {
      queryParams.priceMax = filters.value.priceRange.max.toString()
    }
  }
  
  emit('update:filters', queryParams)
}

const onImageError = (event: Event) => {
  // Fallback para quando a imagem não carregar
  const target = event.target as HTMLImageElement
  target.style.display = 'none'
}

// Load filter options on mount
onMounted(() => {
  loadFilterOptions()
})
</script>