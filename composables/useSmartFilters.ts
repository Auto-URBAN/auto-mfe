import type { FiltersV2, FiltersOptionsV2, Brand, Model } from '~/schemas/filters'
import { FiltersV2Schema } from '~/schemas/filters'

export const useSmartFilters = () => {
  // Estado dos filtros
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

  // Dados das opções de filtros
  const filterOptions = ref<FiltersOptionsV2 | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Carregar opções de filtros
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

  // Computed para modelos filtrados por marca selecionada
  const availableModels = computed(() => {
    if (!filterOptions.value) return []
    
    // Se nenhuma marca selecionada, retorna todos os modelos
    if (filters.value.brands.length === 0) {
      return filterOptions.value.models
    }
    
    // Filtra modelos apenas das marcas selecionadas
    return filterOptions.value.models.filter(model => 
      filters.value.brands.includes(model.brandId)
    )
  })

  // Computed para anos disponíveis baseado em marcas e modelos selecionados
  const availableYears = computed(() => {
    if (!filterOptions.value) return []
    
    let years = new Set<number>()
    
    if (filters.value.brands.length === 0 && filters.value.models.length === 0) {
      // Nenhuma marca ou modelo selecionado - todos os anos
      filterOptions.value.years.forEach(year => years.add(year))
    } else if (filters.value.models.length > 0) {
      // Modelos específicos selecionados - anos desses modelos
      const selectedModels = filterOptions.value.models.filter(model => 
        filters.value.models.includes(model.id)
      )
      selectedModels.forEach(model => {
        model.years.forEach(year => years.add(year))
      })
    } else if (filters.value.brands.length > 0) {
      // Apenas marcas selecionadas - anos de todos os modelos dessas marcas
      const brandsYears = filterOptions.value.brands.filter(brand => 
        filters.value.brands.includes(brand.id)
      )
      brandsYears.forEach(brand => {
        brand.years.forEach(year => years.add(year))
      })
    }
    
    return Array.from(years).sort((a, b) => b - a) // Ordem decrescente
  })

  // Computed para contadores dinâmicos (simulado - em produção viria da API)
  const brandsWithCounts = computed(() => {
    if (!filterOptions.value) return []
    
    return filterOptions.value.brands.map(brand => ({
      ...brand,
      count: getFilteredCount('brand', brand.id)
    }))
  })

  const modelsWithCounts = computed(() => {
    return availableModels.value.map(model => ({
      ...model,
      count: getFilteredCount('model', model.id)
    }))
  })

  const colorsWithCounts = computed(() => {
    if (!filterOptions.value) return []
    
    return filterOptions.value.colors.map(color => ({
      ...color,
      count: getFilteredCount('color', color.id)
    }))
  })

  const statesWithCounts = computed(() => {
    if (!filterOptions.value) return []
    
    return filterOptions.value.states.map(state => ({
      ...state,
      count: getFilteredCount('state', state.id)
    }))
  })

  // Função simulada para contar veículos por filtro
  const getFilteredCount = (filterType: string, filterId: string): number => {
    // Em produção, isso seria uma chamada à API ou cálculo baseado nos dados
    // Por agora, retornamos um número simulado baseado no hash
    const hash = (filterType + filterId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return Math.max(1, hash % 50) // Entre 1 e 49
  }

  // Resetar filtros dependentes quando marca muda
  const updateBrands = (selectedBrands: string[]) => {
    filters.value.brands = selectedBrands
    
    // Se mudou marcas, limpar modelos que não pertencem às marcas selecionadas
    if (selectedBrands.length > 0) {
      const validModels = availableModels.value.map(m => m.id)
      filters.value.models = filters.value.models.filter(modelId => 
        validModels.includes(modelId)
      )
    }
    
    // Limpar anos que não são mais válidos
    const validYears = availableYears.value
    filters.value.years = filters.value.years.filter(year => 
      validYears.includes(year)
    )
  }

  // Resetar anos quando modelo muda
  const updateModels = (selectedModels: string[]) => {
    filters.value.models = selectedModels
    
    // Limpar anos que não são mais válidos
    const validYears = availableYears.value
    filters.value.years = filters.value.years.filter(year => 
      validYears.includes(year)
    )
  }

  // Atualizar outros filtros
  const updateYears = (selectedYears: number[]) => {
    filters.value.years = selectedYears
  }

  const updateColors = (selectedColors: string[]) => {
    filters.value.colors = selectedColors
  }

  const updateStates = (selectedStates: string[]) => {
    filters.value.states = selectedStates
  }

  const updatePriceRange = (range: { min?: number; max?: number } | undefined) => {
    filters.value.priceRange = range
  }

  const updateKmRange = (range: { min?: number; max?: number } | undefined) => {
    filters.value.kmRange = range
  }

  const updateSort = (sort: string) => {
    filters.value.sort = sort
  }

  // Limpar todos os filtros
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
  }

  // Verificar se há filtros ativos
  const hasActiveFilters = computed(() => {
    return filters.value.brands.length > 0 ||
           filters.value.models.length > 0 ||
           filters.value.years.length > 0 ||
           filters.value.colors.length > 0 ||
           filters.value.states.length > 0 ||
           filters.value.priceRange !== undefined ||
           filters.value.kmRange !== undefined
  })

  // Contar filtros ativos
  const activeFiltersCount = computed(() => {
    let count = 0
    if (filters.value.brands.length > 0) count++
    if (filters.value.models.length > 0) count++
    if (filters.value.years.length > 0) count++
    if (filters.value.colors.length > 0) count++
    if (filters.value.states.length > 0) count++
    if (filters.value.priceRange !== undefined) count++
    if (filters.value.kmRange !== undefined) count++
    return count
  })

  // Converter filtros para query parameters
  const toQueryParams = () => {
    const params: Record<string, any> = {
      sort: filters.value.sort
    }

    if (filters.value.brands.length > 0) {
      params.brands = filters.value.brands.join(',')
    }
    if (filters.value.models.length > 0) {
      params.models = filters.value.models.join(',')
    }
    if (filters.value.years.length > 0) {
      params.years = filters.value.years.join(',')
    }
    if (filters.value.colors.length > 0) {
      params.colors = filters.value.colors.join(',')
    }
    if (filters.value.states.length > 0) {
      params.states = filters.value.states.join(',')
    }
    if (filters.value.priceRange) {
      if (filters.value.priceRange.min !== undefined) {
        params.priceMin = filters.value.priceRange.min
      }
      if (filters.value.priceRange.max !== undefined) {
        params.priceMax = filters.value.priceRange.max
      }
    }
    if (filters.value.kmRange) {
      if (filters.value.kmRange.min !== undefined) {
        params.kmMin = filters.value.kmRange.min
      }
      if (filters.value.kmRange.max !== undefined) {
        params.kmMax = filters.value.kmRange.max
      }
    }

    return params
  }

  // Validar filtros com Zod
  const validateFilters = () => {
    try {
      return FiltersV2Schema.parse(filters.value)
    } catch (err) {
      console.error('Invalid filters:', err)
      return null
    }
  }

  return {
    // Estado
    filters: readonly(filters),
    filterOptions: readonly(filterOptions),
    loading: readonly(loading),
    error: readonly(error),

    // Computed
    availableModels,
    availableYears,
    brandsWithCounts,
    modelsWithCounts,
    colorsWithCounts,
    statesWithCounts,
    hasActiveFilters,
    activeFiltersCount,

    // Métodos
    loadFilterOptions,
    updateBrands,
    updateModels,
    updateYears,
    updateColors,
    updateStates,
    updatePriceRange,
    updateKmRange,
    updateSort,
    clearAllFilters,
    toQueryParams,
    validateFilters
  }
}