import type { FiltersV2, FiltersOptionsV2, Brand, Model } from '~/schemas/filters'
import { FiltersV2Schema } from '~/schemas/filters'

export const useSmartFilters = () => {
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

	const availableModels = computed(() => {
		if (!filterOptions.value) return []

		if (filters.value.brands.length === 0) {
			return filterOptions.value.models
		}

		return filterOptions.value.models.filter(model => filters.value.brands.includes(model.brandId))
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

	const getFilteredCount = (filterType: string, filterId: string): number => {
		const hash = (filterType + filterId)
			.split('')
			.reduce((acc, char) => acc + char.charCodeAt(0), 0)
		return Math.max(1, hash % 50)
	}

	const updateBrands = (selectedBrands: string[]) => {
		filters.value.brands = selectedBrands

		if (selectedBrands.length > 0) {
			const validModels = availableModels.value.map(m => m.id)
			filters.value.models = filters.value.models.filter(modelId => validModels.includes(modelId))
		}

		const validYears = availableYears.value
		filters.value.years = filters.value.years.filter(year => validYears.includes(year))
	}

	const updateModels = (selectedModels: string[]) => {
		filters.value.models = selectedModels

		const validYears = availableYears.value
		filters.value.years = filters.value.years.filter(year => validYears.includes(year))
	}

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

	const hasActiveFilters = computed(() => {
		return (
			filters.value.brands.length > 0 ||
			filters.value.models.length > 0 ||
			filters.value.years.length > 0 ||
			filters.value.colors.length > 0 ||
			filters.value.states.length > 0 ||
			filters.value.priceRange !== undefined ||
			filters.value.kmRange !== undefined
		)
	})

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

	const validateFilters = () => {
		try {
			return FiltersV2Schema.parse(filters.value)
		} catch (err) {
			console.error('Invalid filters:', err)
			return null
		}
	}

	return {
		filters: readonly(filters),
		filterOptions: readonly(filterOptions),
		loading: readonly(loading),
		error: readonly(error),

		availableModels,
		availableYears,
		brandsWithCounts,
		modelsWithCounts,
		colorsWithCounts,
		statesWithCounts,
		hasActiveFilters,
		activeFiltersCount,

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
