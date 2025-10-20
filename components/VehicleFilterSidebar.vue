<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="p-2 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <div class="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:funnel-20-solid" class="w-4 h-4 text-white" />
          </div>
          <h3 class="text-lg font-semibold text-white">Filtros</h3>
        </div>
        <UiButton 
          v-if="hasActiveFilters"
          variant="ghost" 
          size="sm" 
          class="text-white hover:bg-white/20 border-white/30 text-sm"
          @click="clearAllFilters"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-1" />
          Limpar
        </UiButton>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6">
      <div class="space-y-4">
        <div v-for="i in 6" :key="i" class="animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-1/3 mb-2"/>
          <div class="h-10 bg-gray-200 rounded"/>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6">
      <UiAlert variant="error" :title="error">
        <UiButton variant="outline" size="sm" @click="loadFilterOptions">
          Tentar novamente
        </UiButton>
      </UiAlert>
    </div>

    <!-- Filters Content -->
    <div v-else-if="filterOptions" class="p-4 space-y-6">
      
      <!-- Brand/Model Flow -->
      <BrandModelFlow
        ref="brandModelFlow"
        :brands="filterOptions.brands"
        :models="filterOptions.models"
        @update:selection="updateBrandModelSelection"
      />

      <!-- Years -->
      <div v-if="availableYears.length > 0" class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:calendar-days-20-solid" class="w-3 h-3 text-orange-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Anos</label>
        </div>
        
        <div class="grid grid-cols-4 gap-2 overflow-y-scroll max-h-20">
          <div 
            v-for="year in availableYears" 
            :key="year"
            class="p-1 text-center border rounded cursor-pointer transition-all duration-200"
            :class="filters.years.includes(year) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'"
            @click="toggleYear(year)"
          >
            <span class="text-xs font-medium">{{ year }}</span>
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
        
        <div class="grid grid-cols-4 gap-2 overflow-y-scroll max-h-24">
          <div 
            v-for="color in filterOptions.colors" 
            :key="color.id"
            class="flex flex-col items-center p-1 border  rounded cursor-pointer transition-all duration-200"
            :class="filters.colors.includes(color.id) ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'"
            @click="toggleColor(color.id)"
          >
            <div 
              class="w-4 h-4 rounded-full border-2 border-gray-400 shadow-sm mb-1"
              :style="{ backgroundColor: color.hex }"
            />
            <span class="text-xs">{{ color.name }}</span>
          </div>
        </div>
      </div>

      <!-- Price Range -->
      <UiRangeSlider
        ref="priceSlider"
        v-model="filters.priceRange"
        :config="priceSliderConfig"
        label="Faixa de Preço"
        icon="heroicons:currency-dollar-20-solid"
        unit=""
        variant="price"
        @update:model-value="updatePriceRange"
      />

      <!-- KM Range -->
      <UiRangeSlider
        ref="kmSlider"
        v-model="filters.kmRange"
        :config="kmSliderConfig"
        label="Quilometragem"
        icon="heroicons:map-pin-20-solid"
        unit=" km"
        variant="km"
        @update:model-value="updateKmRange"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import type { FiltersOptionsV2 } from '~/schemas/filters'

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
const filters = ref({
  brandModelCombos: [] as any[],
  years: [] as number[],
  colors: [] as string[],
  priceRange: { min: undefined, max: undefined } as any,
  kmRange: { min: undefined, max: undefined } as any,
  sort: 'recent'
})

// Slider configurations
const priceSliderConfig = {
  min: 0,
  max: 500000,
  step: 5000
}

const kmSliderConfig = {
  min: 0,
  max: 300000,
  step: 5000
}

const filterOptions = ref<FiltersOptionsV2 | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const brandModelFlow = ref()
const priceSlider = ref()
const kmSlider = ref()

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.brandModelCombos.length > 0 ||
         filters.value.years.length > 0 ||
         filters.value.colors.length > 0 ||
         (filters.value.priceRange && (filters.value.priceRange.min || filters.value.priceRange.max)) ||
         (filters.value.kmRange && (filters.value.kmRange.min || filters.value.kmRange.max))
})

const availableYears = computed(() => {
  if (!filterOptions.value) return []
  
  const years = new Set<number>()
  
  if (filters.value.brandModelCombos.length === 0) {
    filterOptions.value.years.forEach(year => years.add(year))
  } else {
    // Filter years based on selected brand/model combos
    const selectedBrandIds = filters.value.brandModelCombos.map(combo => combo.brandId)
    const selectedModelIds = filters.value.brandModelCombos.map(combo => combo.modelId)
    
    const brandsYears = filterOptions.value.brands.filter(brand => 
      selectedBrandIds.includes(brand.id)
    )
    brandsYears.forEach(brand => {
      brand.years.forEach(year => years.add(year))
    })

    const modelsYears = filterOptions.value.models.filter(model => 
      selectedModelIds.includes(model.id)
    )
    modelsYears.forEach(model => {
      model.years.forEach(year => years.add(year))
    })
  }
  
  return Array.from(years).sort((a, b) => b - a)
})

// Methods
const loadFilterOptions = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await $fetch<FiltersOptionsV2>('/api/filters')
    filterOptions.value = response
  } catch (err) {
    error.value = 'Erro ao carregar opções de filtros'
    console.error('Error loading filter options:', err)
  } finally {
    loading.value = false
  }
}

const updateBrandModelSelection = (combos: any[]) => {
  filters.value.brandModelCombos = combos
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

const updatePriceRange = (value: any) => {
  filters.value.priceRange = value
  emitFilters()
}

const updateKmRange = (value: any) => {
  filters.value.kmRange = value
  emitFilters()
}

const clearAllFilters = () => {
  filters.value = {
    brandModelCombos: [],
    years: [],
    colors: [],
    priceRange: { min: undefined, max: undefined },
    kmRange: { min: undefined, max: undefined },
    sort: 'recent'
  }
  
  // Reset sliders
  priceSlider.value?.reset()
  kmSlider.value?.reset()
  
  brandModelFlow.value?.clearSelection()
  emitFilters()
}

const emitFilters = () => {
  // Converter para formato compatível com a API existente
  const queryParams: any = {
    sort: filters.value.sort
  }
  
  if (filters.value.brandModelCombos.length > 0) {
    // Por enquanto, usar apenas o primeiro combo
    const firstCombo = filters.value.brandModelCombos[0]
    queryParams.make = firstCombo.brandId
    queryParams.model = firstCombo.modelId
  }
  
  if (filters.value.years.length > 0) {
    const sortedYears = [...filters.value.years].sort()
    queryParams.yearMin = sortedYears[0]?.toString() || ''
    queryParams.yearMax = sortedYears[sortedYears.length - 1]?.toString() || ''
  }
  
  if (filters.value.colors.length > 0) {
    queryParams.color = filters.value.colors[0]
  }
  
  if (filters.value.priceRange && (filters.value.priceRange.min || filters.value.priceRange.max)) {
    if (filters.value.priceRange.min) {
      queryParams.priceMin = filters.value.priceRange.min.toString()
    }
    if (filters.value.priceRange.max) {
      queryParams.priceMax = filters.value.priceRange.max.toString()
    }
  }

  if (filters.value.kmRange && (filters.value.kmRange.min || filters.value.kmRange.max)) {
    if (filters.value.kmRange.min) {
      queryParams.kmMin = filters.value.kmRange.min.toString()
    }
    if (filters.value.kmRange.max) {
      queryParams.kmMax = filters.value.kmRange.max.toString()
    }
  }
  
  emit('update:filters', queryParams)
}

// Load filter options on mount
onMounted(() => {
  loadFilterOptions()
})
</script>
