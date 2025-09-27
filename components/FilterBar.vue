<template>
  <div class="bg-white border-b sticky top-0 z-20">
    <!-- Mobile filter button -->
    <div class="md:hidden p-4">
      <UButton 
        @click="showMobileFilters = true"
        color="gray" 
        variant="outline" 
        size="lg"
        class="w-full"
      >
        <UIcon name="i-heroicons-adjustments-horizontal" class="mr-2" />
        Filtros
        <UBadge v-if="activeFiltersCount > 0" color="primary" class="ml-2">
          {{ activeFiltersCount }}
        </UBadge>
      </UButton>
    </div>

    <!-- Desktop filters -->
    <div class="hidden md:block p-4">
      <div class="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <!-- Brand filter -->
        <USelectMenu 
          v-model="filters.make"
          :options="brandOptions"
          placeholder="Marca"
          size="sm"
          @change="handleFilterChange"
        />
        
        <!-- State filter -->
        <USelectMenu 
          v-model="filters.uf"
          :options="stateOptions"
          placeholder="Estado"
          size="sm"
          @change="handleFilterChange"
        />
        
        <!-- Price range -->
        <UInput
          v-model="filters.priceMin"
          placeholder="Preço mín"
          type="number"
          size="sm"
          @input="handleFilterChange"
        />
        
        <UInput
          v-model="filters.priceMax"
          placeholder="Preço máx"
          type="number" 
          size="sm"
          @input="handleFilterChange"
        />
        
        <!-- Year range -->
        <UInput
          v-model="filters.yearMin"
          placeholder="Ano mín"
          type="number"
          size="sm"
          @input="handleFilterChange"
        />
        
        <UInput
          v-model="filters.yearMax"
          placeholder="Ano máx"
          type="number"
          size="sm"
          @input="handleFilterChange"
        />
      </div>
    </div>

    <!-- Active filters chips -->
    <div v-if="activeFiltersCount > 0" class="px-4 pb-4">
      <div class="flex flex-wrap gap-2">
        <UBadge 
          v-for="chip in activeFilterChips" 
          :key="chip.key"
          color="primary" 
          variant="soft"
          class="cursor-pointer"
          @click="removeFilter(chip.key)"
        >
          {{ chip.label }}
          <UIcon name="i-heroicons-x-mark" class="ml-1 w-3 h-3" />
        </UBadge>
        
        <UButton 
          v-if="activeFiltersCount > 1"
          @click="clearAllFilters"
          color="gray" 
          variant="ghost" 
          size="xs"
        >
          Limpar tudo
        </UButton>
      </div>
    </div>

    <!-- Mobile filter drawer -->
    <USlideover v-model="showMobileFilters" side="bottom">
      <div class="p-4">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">Filtros</h3>
          <UButton 
            @click="showMobileFilters = false"
            color="gray" 
            variant="ghost" 
            size="sm"
            square
          >
            <UIcon name="i-heroicons-x-mark" />
          </UButton>
        </div>
        
        <div class="space-y-4">
          <!-- Mobile filter controls (same as desktop but vertical) -->
          <div>
            <label class="block text-sm font-medium mb-2">Marca</label>
            <USelectMenu 
              v-model="filters.make"
              :options="brandOptions"
              placeholder="Selecione a marca"
              class="w-full"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-2">Estado</label>
            <USelectMenu 
              v-model="filters.uf"
              :options="stateOptions"
              placeholder="Selecione o estado"
              class="w-full"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Preço mínimo</label>
              <UInput
                v-model="filters.priceMin"
                placeholder="R$ 0"
                type="number"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Preço máximo</label>
              <UInput
                v-model="filters.priceMax"
                placeholder="R$ 999.999"
                type="number"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2">Ano mínimo</label>
              <UInput
                v-model="filters.yearMin"
                placeholder="2000"
                type="number"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium mb-2">Ano máximo</label>
              <UInput
                v-model="filters.yearMax"
                placeholder="2024"
                type="number"
              />
            </div>
          </div>
        </div>
        
        <div class="flex gap-3 mt-6">
          <UButton 
            @click="clearAllFilters"
            color="gray" 
            variant="outline"
            class="flex-1"
          >
            Limpar
          </UButton>
          
          <UButton 
            @click="applyFilters"
            color="primary"
            class="flex-1"
          >
            Aplicar
          </UButton>
        </div>
      </div>
    </USlideover>
  </div>
</template>

<script setup lang="ts">
import type { SearchFilters } from '@/schemas/vehicle'

interface Emits {
  filterChange: [filters: SearchFilters]
}

const emit = defineEmits<Emits>()

const showMobileFilters = ref(false)

// Filter state
const filters = ref<SearchFilters>({
  q: '',
  make: undefined,
  uf: undefined,
  priceMin: undefined,
  priceMax: undefined,
  yearMin: undefined,
  yearMax: undefined,
  kmMax: undefined
})

// Filter options
const brandOptions = [
  'Toyota', 'Honda', 'Volkswagen', 'Ford', 'Chevrolet', 'Hyundai',
  'Nissan', 'Fiat', 'Renault', 'Peugeot'
]

const stateOptions = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
]

// Computed
const activeFiltersCount = computed(() => {
  return Object.values(filters.value).filter(value => 
    value !== '' && value !== undefined && value !== null
  ).length
})

const activeFilterChips = computed(() => {
  const chips: Array<{ key: keyof SearchFilters; label: string }> = []
  
  if (filters.value.make) {
    chips.push({ key: 'make', label: filters.value.make })
  }
  
  if (filters.value.uf) {
    chips.push({ key: 'uf', label: filters.value.uf })
  }
  
  if (filters.value.priceMin) {
    chips.push({ 
      key: 'priceMin', 
      label: `Mín: ${formatCurrency(filters.value.priceMin)}`
    })
  }
  
  if (filters.value.priceMax) {
    chips.push({ 
      key: 'priceMax', 
      label: `Máx: ${formatCurrency(filters.value.priceMax)}`
    })
  }
  
  if (filters.value.yearMin) {
    chips.push({ key: 'yearMin', label: `A partir de ${filters.value.yearMin}` })
  }
  
  if (filters.value.yearMax) {
    chips.push({ key: 'yearMax', label: `Até ${filters.value.yearMax}` })
  }
  
  return chips
})

// Methods
function handleFilterChange() {
  emit('filterChange', { ...filters.value })
}

function removeFilter(key: keyof SearchFilters) {
  if (typeof filters.value[key] === 'number') {
    filters.value[key] = undefined
  } else {
    filters.value[key] = '' as any
  }
  handleFilterChange()
}

function clearAllFilters() {
  filters.value = {
    q: '',
    make: undefined,
    uf: undefined,
    priceMin: undefined,
    priceMax: undefined,
    yearMin: undefined,
    yearMax: undefined,
    kmMax: undefined
  }
  handleFilterChange()
}

function applyFilters() {
  showMobileFilters.value = false
  handleFilterChange()
}

// Helper
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value)
}
</script>