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
          @click="clearAllFilters" 
          variant="ghost" 
          size="sm"
          class="text-white hover:bg-white/20 border-white/30 text-sm"
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
    <div v-else-if="filterOptions" class="p-4 space-y-6">
      
      <!-- Brand/Model Flow -->
      <BrandModelFlow
        :brands="filterOptions.brands"
        :models="filterOptions.models"
        @update:selection="updateBrandModelSelection"
        ref="brandModelFlow"
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
            @click="toggleYear(year)"
            class="p-1 text-center border rounded cursor-pointer transition-all duration-200"
            :class="filters.years.includes(year) ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'"
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
            @click="toggleColor(color.id)"
            class="flex flex-col items-center p-1 border  rounded cursor-pointer transition-all duration-200"
            :class="filters.colors.includes(color.id) ? 'border-pink-500 bg-pink-50' : 'border-gray-200 hover:border-gray-300'"
          >
            <div 
              class="w-4 h-4 rounded-full border-2 border-gray-400 shadow-sm mb-1"
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
        
        <!-- Price Inputs -->
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-xs text-gray-500">Mínimo</label>
            <div class="relative">
              <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">R$</span>
              <input
                v-model.number="priceMin"
                @input="updatePriceRange"
                type="number"
                placeholder="0"
                class="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-gray-500">Máximo</label>
            <div class="relative">
              <span class="absolute left-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">R$</span>
              <input
                v-model.number="priceMax"
                @input="updatePriceRange"
                type="number"
                placeholder="Sem limite"
                class="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>
        </div>

        <!-- Price Range Slider -->
        <div class="px-2">
          <div class="relative py-4">
            <!-- Range Track -->
            <div class="h-2 bg-gray-200 rounded-full relative">
              <div 
                class="h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full absolute"
                :style="priceRangeStyle"
              ></div>
            </div>
            
            <!-- Min Range Input -->
            <input
              v-model.number="priceMin"
              @input="updatePriceRange"
              type="range"
              :min="priceSliderConfig.min"
              :max="priceSliderConfig.max"
              :step="priceSliderConfig.step"
              class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-10"
              style="pointer-events: none;"
            />
            <input
              v-model.number="priceMax"
              @input="updatePriceRange"
              type="range"
              :min="priceSliderConfig.min"
              :max="priceSliderConfig.max"
              :step="priceSliderConfig.step"
              class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-20"
            />
            
            <!-- Custom Thumbs -->
            <div 
              class="absolute w-4 h-4 bg-red-500 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
              :style="{ left: priceMinThumbPosition }"
              @mousedown="startDrag('priceMin', $event)"
            ></div>
            <div 
              class="absolute w-4 h-4 bg-red-600 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
              :style="{ left: priceMaxThumbPosition }"
              @mousedown="startDrag('priceMax', $event)"
            ></div>
          </div>
          
          <!-- Price Labels -->
          <div class="flex justify-between mt-2 text-xs text-gray-500">
            <span>R$ {{ formatPrice(priceSliderConfig.min) }}</span>
            <span>R$ {{ formatPrice(priceSliderConfig.max) }}</span>
          </div>
        </div>
      </div>

      <!-- KM Range -->
      <div class="space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Icon name="heroicons:map-pin-20-solid" class="w-3 h-3 text-indigo-600" />
          </div>
          <label class="text-sm font-medium text-gray-800">Quilometragem</label>
        </div>
        
        <!-- KM Inputs -->
        <div class="grid grid-cols-2 gap-2">
          <div class="space-y-1">
            <label class="text-xs text-gray-500">Mínimo</label>
            <div class="relative">
              <input
                v-model.number="kmMin"
                @input="updateKmRange"
                type="number"
                placeholder="0"
                class="w-full pr-8 pl-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">km</span>
            </div>
          </div>
          <div class="space-y-1">
            <label class="text-xs text-gray-500">Máximo</label>
            <div class="relative">
              <input
                v-model.number="kmMax"
                @input="updateKmRange"
                type="number"
                placeholder="Sem limite"
                class="w-full pr-8 pl-2 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <span class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">km</span>
            </div>
          </div>
        </div>

        <!-- KM Range Slider -->
        <div class="px-2">
          <div class="relative py-4">
            <!-- Range Track -->
            <div class="h-2 bg-gray-200 rounded-full relative">
              <div 
                class="h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full absolute"
                :style="kmRangeStyle"
              ></div>
            </div>
            
            <!-- Min Range Input -->
            <input
              v-model.number="kmMin"
              @input="updateKmRange"
              type="range"
              :min="kmSliderConfig.min"
              :max="kmSliderConfig.max"
              :step="kmSliderConfig.step"
              class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-10"
              style="pointer-events: none;"
            />
            <input
              v-model.number="kmMax"
              @input="updateKmRange"
              type="range"
              :min="kmSliderConfig.min"
              :max="kmSliderConfig.max"
              :step="kmSliderConfig.step"
              class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-20"
            />
            
            <!-- Custom Thumbs -->
            <div 
              class="absolute w-4 h-4 bg-indigo-500 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
              :style="{ left: kmMinThumbPosition }"
              @mousedown="startDrag('kmMin', $event)"
            ></div>
            <div 
              class="absolute w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
              :style="{ left: kmMaxThumbPosition }"
              @mousedown="startDrag('kmMax', $event)"
            ></div>
          </div>
          
          <!-- KM Labels -->
          <div class="flex justify-between mt-2 text-xs text-gray-500">
            <span>{{ formatKm(kmSliderConfig.min) }} km</span>
            <span>{{ formatKm(kmSliderConfig.max) }} km</span>
          </div>
        </div>
      </div>

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
  priceRange: undefined as any,
  kmRange: undefined as any,
  sort: 'recent'
})

// Slider values
const priceMin = ref(0)
const priceMax = ref(0)
const kmMin = ref(0)
const kmMax = ref(0)

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

// Drag state
const isDragging = ref(false)
const dragType = ref<'priceMin' | 'priceMax' | 'kmMin' | 'kmMax' | null>(null)

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.brandModelCombos.length > 0 ||
         filters.value.years.length > 0 ||
         filters.value.colors.length > 0 ||
         filters.value.priceRange ||
         filters.value.kmRange
})

const availableYears = computed(() => {
  if (!filterOptions.value) return []
  
  let years = new Set<number>()
  
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

// Computed properties for slider styles
const priceRangeStyle = computed(() => {
  const min = Math.max(priceMin.value || priceSliderConfig.min, priceSliderConfig.min)
  const max = Math.min(priceMax.value || priceSliderConfig.max, priceSliderConfig.max)
  
  const leftPercent = ((min - priceSliderConfig.min) / (priceSliderConfig.max - priceSliderConfig.min)) * 100
  const rightPercent = ((priceSliderConfig.max - max) / (priceSliderConfig.max - priceSliderConfig.min)) * 100
  
  return {
    left: `${leftPercent}%`,
    right: `${rightPercent}%`
  }
})

const kmRangeStyle = computed(() => {
  const min = Math.max(kmMin.value || kmSliderConfig.min, kmSliderConfig.min)
  const max = Math.min(kmMax.value || kmSliderConfig.max, kmSliderConfig.max)
  
  const leftPercent = ((min - kmSliderConfig.min) / (kmSliderConfig.max - kmSliderConfig.min)) * 100
  const rightPercent = ((kmSliderConfig.max - max) / (kmSliderConfig.max - kmSliderConfig.min)) * 100
  
  return {
    left: `${leftPercent}%`,
    right: `${rightPercent}%`
  }
})

// Computed properties for thumb positions
const priceMinThumbPosition = computed(() => {
  const value = priceMin.value || priceSliderConfig.min
  const percent = ((value - priceSliderConfig.min) / (priceSliderConfig.max - priceSliderConfig.min)) * 100
  return `${percent}%`
})

const priceMaxThumbPosition = computed(() => {
  const value = priceMax.value || priceSliderConfig.max
  const percent = ((value - priceSliderConfig.min) / (priceSliderConfig.max - priceSliderConfig.min)) * 100
  return `${percent}%`
})

const kmMinThumbPosition = computed(() => {
  const value = kmMin.value || kmSliderConfig.min
  const percent = ((value - kmSliderConfig.min) / (kmSliderConfig.max - kmSliderConfig.min)) * 100
  return `${percent}%`
})

const kmMaxThumbPosition = computed(() => {
  const value = kmMax.value || kmSliderConfig.max
  const percent = ((value - kmSliderConfig.min) / (kmSliderConfig.max - kmSliderConfig.min)) * 100
  return `${percent}%`
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

const updatePriceRange = () => {
  // Ensure min is not greater than max
  if (priceMin.value && priceMax.value && priceMin.value > priceMax.value) {
    priceMax.value = priceMin.value
  }
  
  filters.value.priceRange = {
    min: priceMin.value || undefined,
    max: priceMax.value || undefined
  }
  emitFilters()
}

const updateKmRange = () => {
  // Ensure min is not greater than max
  if (kmMin.value && kmMax.value && kmMin.value > kmMax.value) {
    kmMax.value = kmMin.value
  }
  
  filters.value.kmRange = {
    min: kmMin.value || undefined,
    max: kmMax.value || undefined
  }
  emitFilters()
}

const formatPrice = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toString()
}

const formatKm = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`
  }
  return value.toString()
}

const clearAllFilters = () => {
  filters.value = {
    brandModelCombos: [],
    years: [],
    colors: [],
    priceRange: undefined,
    kmRange: undefined,
    sort: 'recent'
  }
  
  // Reset slider values
  priceMin.value = priceSliderConfig.min
  priceMax.value = priceSliderConfig.max
  kmMin.value = kmSliderConfig.min
  kmMax.value = kmSliderConfig.max
  
  brandModelFlow.value?.clearSelection()
  emitFilters()
}

const startDrag = (type: 'priceMin' | 'priceMax' | 'kmMin' | 'kmMax', event: MouseEvent) => {
  event.preventDefault()
  isDragging.value = true
  dragType.value = type
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !dragType.value) return
    
    const rect = (event.target as HTMLElement).closest('.relative')?.getBoundingClientRect()
    if (!rect) return
    
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    
    if (dragType.value.startsWith('price')) {
      const value = Math.round((percent / 100) * (priceSliderConfig.max - priceSliderConfig.min) + priceSliderConfig.min)
      const steppedValue = Math.round(value / priceSliderConfig.step) * priceSliderConfig.step
      
      if (dragType.value === 'priceMin') {
        priceMin.value = Math.min(steppedValue, priceMax.value || priceSliderConfig.max)
      } else {
        priceMax.value = Math.max(steppedValue, priceMin.value || priceSliderConfig.min)
      }
      updatePriceRange()
    } else {
      const value = Math.round((percent / 100) * (kmSliderConfig.max - kmSliderConfig.min) + kmSliderConfig.min)
      const steppedValue = Math.round(value / kmSliderConfig.step) * kmSliderConfig.step
      
      if (dragType.value === 'kmMin') {
        kmMin.value = Math.min(steppedValue, kmMax.value || kmSliderConfig.max)
      } else {
        kmMax.value = Math.max(steppedValue, kmMin.value || kmSliderConfig.min)
      }
      updateKmRange()
    }
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    dragType.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
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
  
  if (filters.value.priceRange) {
    if (filters.value.priceRange.min) {
      queryParams.priceMin = filters.value.priceRange.min.toString()
    }
    if (filters.value.priceRange.max) {
      queryParams.priceMax = filters.value.priceRange.max.toString()
    }
  }

  if (filters.value.kmRange) {
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
  
  // Initialize slider values
  priceMin.value = priceSliderConfig.min
  priceMax.value = priceSliderConfig.max
  kmMin.value = kmSliderConfig.min
  kmMax.value = kmSliderConfig.max
})
</script>