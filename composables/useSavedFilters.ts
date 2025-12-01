interface SavedFilter {
	id: string
	name: string
	filters: SearchFilters
	createdAt: string
	userId?: string
}

interface SearchFilters {
	q?: string
	make?: string
	uf?: string
	priceMin?: number
	priceMax?: number
	yearMin?: number
	yearMax?: number
	kmMax?: number
	category?: string
}

const STORAGE_KEY = 'auto-urban-saved-filters'
//Máximo de filtros salvos
const MAX_FILTERS = 5

export const useSavedFilters = () => {
	const { user } = useAuthSimple()

	//Estado local dos filtros salvos
	const savedFilters = ref<SavedFilter[]>([])

	//Carregar filtros salvos do localStorage
	const loadSavedFilters = (): void => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY)
			if (stored) {
				const filters = JSON.parse(stored) as SavedFilter[]
				//Filtrar apenas filtros do usuário atual ou filtros locais (sem userId)
				savedFilters.value = filters.filter(
					f => !user.value || !f.userId || f.userId === user.value.id
				)
			}
		} catch (error) {
			console.error('Erro ao carregar filtros salvos:', error)
			savedFilters.value = []
		}
	}

	//Salvar filtros no localStorage
	const saveTolocalStorage = (): void => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(savedFilters.value))
		} catch (error) {
			console.error('Erro ao salvar filtros:', error)
		}
	}

	//Salvar um novo filtro
	const saveFilter = (name: string, filters: SearchFilters): SavedFilter => {
		//Verificar se já existe um filtro com o mesmo nome
		const existingIndex = savedFilters.value.findIndex(f => f.name === name)

		const newFilter: SavedFilter = {
			id: Date.now().toString(),
			name,
			filters: { ...filters },
			createdAt: new Date().toISOString(),
			userId: user.value?.id
		}

		if (existingIndex > -1) {
			//Atualizar filtro existente
			savedFilters.value[existingIndex] = newFilter
		} else {
			//Adicionar novo filtro
			savedFilters.value.unshift(newFilter)

			//Limitar número de filtros salvos
			if (savedFilters.value.length > MAX_FILTERS) {
				savedFilters.value = savedFilters.value.slice(0, MAX_FILTERS)
			}
		}

		saveTolocalStorage()
		return newFilter
	}

	//Remover um filtro salvo
	const removeFilter = (filterId: string): void => {
		savedFilters.value = savedFilters.value.filter(f => f.id !== filterId)
		saveTolocalStorage()
	}

	//Limpar todos os filtros salvos
	const clearAllFilters = (): void => {
		savedFilters.value = []
		saveTolocalStorage()
	}

	//Verificar se um conjunto de filtros já está salvo
	const isFilterSaved = (filters: SearchFilters): boolean => {
		return savedFilters.value.some(f => JSON.stringify(f.filters) === JSON.stringify(filters))
	}

	//Aplicar um filtro salvo
	const applyFilter = (filterId: string): SearchFilters | null => {
		const filter = savedFilters.value.find(f => f.id === filterId)
		return filter ? { ...filter.filters } : null
	}

	//Função para formatar nome do filtro automaticamente
	const generateFilterName = (filters: SearchFilters): string => {
		const parts: string[] = []

		if (filters.make) {
			parts.push(filters.make)
		}

		if (filters.uf) {
			parts.push(filters.uf)
		}

		if (filters.priceMin || filters.priceMax) {
			if (filters.priceMin && filters.priceMax) {
				parts.push(
					`R$ ${filters.priceMin.toLocaleString('pt-BR')} - R$ ${filters.priceMax.toLocaleString('pt-BR')}`
				)
			} else if (filters.priceMin) {
				parts.push(`Acima de R$ ${filters.priceMin.toLocaleString('pt-BR')}`)
			} else if (filters.priceMax) {
				parts.push(`Até R$ ${filters.priceMax.toLocaleString('pt-BR')}`)
			}
		}

		if (filters.yearMin || filters.yearMax) {
			if (filters.yearMin && filters.yearMax) {
				parts.push(`${filters.yearMin} - ${filters.yearMax}`)
			} else if (filters.yearMin) {
				parts.push(`A partir de ${filters.yearMin}`)
			} else if (filters.yearMax) {
				parts.push(`Até ${filters.yearMax}`)
			}
		}

		if (filters.category && filters.category !== 'todos') {
			const categoryNames: Record<string, string> = {
				esportivos: 'Esportivos',
				luxo: 'Luxo',
				compactos: 'Compactos',
				suv: 'SUVs',
				eletricos: 'Elétricos'
			}
			parts.push(categoryNames[filters.category] || filters.category)
		}

		if (parts.length === 0) {
			return 'Filtro Personalizado'
		}

		//Limitar tamanho do nome
		const name = parts.join(' • ')
		return name.length > 50 ? `${name.substring(0, 47)}...` : name
	}

	//Computed para filtros mais recentes
	const recentFilters = computed(() =>
		savedFilters.value
			.slice()
			.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
			.slice(0, 3)
	)

	//Computed para verificar se tem filtros salvos
	const hasFilters = computed(() => savedFilters.value.length > 0)

	//Auto-carregar filtros quando inicializar
	onMounted(() => {
		loadSavedFilters()
	})

	//Recarregar filtros quando usuário mudar
	watch(
		() => user.value?.id,
		() => {
			loadSavedFilters()
		}
	)

	return {
		savedFilters: readonly(savedFilters),
		recentFilters,
		hasFilters,
		loadSavedFilters,
		saveFilter,
		removeFilter,
		clearAllFilters,
		isFilterSaved,
		applyFilter,
		generateFilterName
	}
}
