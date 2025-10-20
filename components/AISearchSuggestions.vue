<template>
	<div class="relative">
		<!-- Search Input -->
		<div class="relative">
			<input
				v-model="searchQuery"
				@input="handleInput"
				@focus="showSuggestions = true"
				@blur="handleBlur"
				placeholder="Busque por carros esportivos, econômicos, familiares..."
				class="w-full px-4 py-3 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
				:class="isProcessing ? 'bg-blue-50' : 'bg-white'"
			/>

			<!-- Search Icon -->
			<div class="absolute left-4 top-1/2 transform -translate-y-1/2">
				<Icon
					:name="
						isProcessing ? 'heroicons:sparkles-20-solid' : 'heroicons:magnifying-glass-20-solid'
					"
					class="w-5 h-5 transition-all duration-200"
					:class="isProcessing ? 'text-blue-500 animate-pulse' : 'text-gray-400'"
				/>
			</div>

			<!-- AI Processing Indicator -->
			<div v-if="isProcessing" class="absolute right-4 top-1/2 transform -translate-y-1/2">
				<div class="flex items-center gap-2">
					<div
						class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
						style="animation-delay: 0ms"
					></div>
					<div
						class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
						style="animation-delay: 150ms"
					></div>
					<div
						class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
						style="animation-delay: 300ms"
					></div>
				</div>
			</div>

			<!-- Clear Button -->
			<button
				v-if="searchQuery && !isProcessing"
				@click="clearSearch"
				class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
			>
				<Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
			</button>
		</div>

		<!-- AI Suggestions Dropdown -->
		<div
			v-if="showSuggestions && (suggestions.length > 0 || categories.length > 0)"
			class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
		>
			<!-- AI Interpretation -->
			<div v-if="aiInterpretation" class="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
				<div class="flex items-start gap-3">
					<Icon name="heroicons:sparkles-20-solid" class="w-5 h-5 text-blue-500 mt-0.5" />
					<div>
						<p class="text-sm font-medium text-blue-900">Entendi que você busca:</p>
						<p class="text-sm text-blue-700 mt-1">{{ aiInterpretation }}</p>
						<div class="flex flex-wrap gap-2 mt-2">
							<span
								v-for="filter in suggestedFilters"
								:key="filter.key"
								class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
							>
								{{ filter.label }}
							</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Quick Categories -->
			<div v-if="categories.length > 0 && !searchQuery" class="p-3">
				<p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Categorias Populares
				</p>
				<div class="grid grid-cols-2 gap-2">
					<button
						v-for="category in categories"
						:key="category.id"
						@mousedown.prevent="selectCategory(category)"
						class="flex items-center gap-2 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
					>
						<Icon :name="category.icon" class="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
						<div>
							<div class="font-medium text-sm">{{ category.name }}</div>
							<div class="text-xs text-gray-500">{{ category.description }}</div>
						</div>
					</button>
				</div>
			</div>

			<!-- Smart Suggestions -->
			<div v-if="suggestions.length > 0" class="p-3">
				<p class="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
					Sugestões Inteligentes
				</p>
				<div class="space-y-1">
					<button
						v-for="suggestion in suggestions"
						:key="suggestion.id"
						@mousedown.prevent="selectSuggestion(suggestion)"
						class="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
					>
						<div class="flex items-center gap-3">
							<Icon
								:name="suggestion.icon"
								class="w-4 h-4 text-gray-400 group-hover:text-blue-500"
							/>
							<div>
								<div class="font-medium text-sm">{{ suggestion.text }}</div>
								<div class="text-xs text-gray-500">{{ suggestion.description }}</div>
							</div>
						</div>
						<div class="flex items-center gap-1 text-xs text-gray-400">
							<Icon name="heroicons:arrow-right-20-solid" class="w-3 h-3" />
						</div>
					</button>
				</div>
			</div>

			<!-- Apply AI Filters Button -->
			<div v-if="suggestedFilters.length > 0" class="p-3 border-t">
				<UiButton @click="applyAIFilters" class="w-full" size="sm">
					<Icon name="heroicons:sparkles-20-solid" class="w-4 h-4 mr-2" />
					Aplicar Filtros Inteligentes ({{ suggestedFilters.length }})
				</UiButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Suggestion {
	id: string
	text: string
	description: string
	icon: string
	filters: Record<string, any>
}

interface Category {
	id: string
	name: string
	description: string
	icon: string
	query: string
	filters: Record<string, any>
}

interface AIFilter {
	key: string
	label: string
	value: any
}

interface Emits {
	(e: 'search', query: string): void
	(e: 'apply-filters', filters: Record<string, any>): void
}

const emit = defineEmits<Emits>()

// State
const searchQuery = ref('')
const showSuggestions = ref(false)
const isProcessing = ref(false)
const aiInterpretation = ref('')
const suggestedFilters = ref<AIFilter[]>([])

// Mock AI Categories
const categories = ref<Category[]>([
	{
		id: 'esportivos',
		name: 'Carros Esportivos',
		description: 'Velocidade e performance',
		icon: 'heroicons:bolt-20-solid',
		query: 'carros esportivos',
		filters: { category: 'esportivo', priceMin: '200000' }
	},
	{
		id: 'economicos',
		name: 'Econômicos',
		description: 'Baixo consumo, bom custo',
		icon: 'heroicons:currency-dollar-20-solid',
		query: 'carros econômicos',
		filters: { category: 'economico', priceMax: '100000' }
	},
	{
		id: 'familia',
		name: 'Para Família',
		description: 'Espaço e conforto',
		icon: 'heroicons:users-20-solid',
		query: 'carros para família',
		filters: { category: 'familia', seats: '5+' }
	},
	{
		id: 'luxo',
		name: 'Luxo',
		description: 'Sofisticação e elegância',
		icon: 'heroicons:star-20-solid',
		query: 'carros de luxo',
		filters: { category: 'luxo', priceMin: '300000' }
	}
])

// Dynamic suggestions based on input
const suggestions = computed(() => {
	if (!searchQuery.value || searchQuery.value.length < 3) return []

	const query = searchQuery.value.toLowerCase()
	const mockSuggestions: Suggestion[] = []

	// Brand suggestions
	if (query.includes('bmw') || query.includes('audi') || query.includes('mercedes')) {
		mockSuggestions.push({
			id: 'premium-brands',
			text: 'Marcas Premium Alemãs',
			description: 'BMW, Audi, Mercedes-Benz',
			icon: 'heroicons:building-office-2-20-solid',
			filters: {
				make: query.includes('bmw') ? 'bmw' : query.includes('audi') ? 'audi' : 'mercedes'
			}
		})
	}

	// Price suggestions
	if (query.includes('barato') || query.includes('econômico') || query.includes('até')) {
		mockSuggestions.push({
			id: 'budget-cars',
			text: 'Carros até R$ 80k',
			description: 'Opções econômicas e em conta',
			icon: 'heroicons:currency-dollar-20-solid',
			filters: { priceMax: '80000' }
		})
	}

	// Year suggestions
	if (query.includes('novo') || query.includes('2023') || query.includes('2024')) {
		mockSuggestions.push({
			id: 'new-cars',
			text: 'Carros Novos (2023-2024)',
			description: 'Últimos lançamentos',
			icon: 'heroicons:calendar-days-20-solid',
			filters: { yearMin: '2023' }
		})
	}

	// Fuel type suggestions
	if (query.includes('flex') || query.includes('álcool') || query.includes('etanol')) {
		mockSuggestions.push({
			id: 'flex-fuel',
			text: 'Carros Flex',
			description: 'Álcool ou gasolina',
			icon: 'heroicons:beaker-20-solid',
			filters: { fuel: 'flex' }
		})
	}

	// Performance suggestions
	if (query.includes('esportivo') || query.includes('rápido') || query.includes('potente')) {
		mockSuggestions.push({
			id: 'sports-cars',
			text: 'Carros Esportivos',
			description: 'Alta performance e estilo',
			icon: 'heroicons:bolt-20-solid',
			filters: { category: 'esportivo', priceMin: '150000' }
		})
	}

	return mockSuggestions.slice(0, 5)
})

// Methods
const handleInput = () => {
	if (searchQuery.value.length >= 3) {
		processAIQuery()
	} else {
		clearAIInterpretation()
	}
}

const processAIQuery = async () => {
	isProcessing.value = true

	// Simulate AI processing delay
	await new Promise(resolve => setTimeout(resolve, 800))

	const query = searchQuery.value.toLowerCase()
	const filters: AIFilter[] = []
	let interpretation = ''

	// Mock AI interpretation logic
	if (query.includes('esportivo') || query.includes('rápido') || query.includes('performance')) {
		interpretation = 'Um carro esportivo com boa performance'
		filters.push(
			{ key: 'category', label: 'Categoria: Esportivo', value: 'esportivo' },
			{ key: 'priceMin', label: 'Preço mínimo: R$ 150k', value: '150000' }
		)
	} else if (query.includes('econômico') || query.includes('barato') || query.includes('consumo')) {
		interpretation = 'Um carro econômico com bom custo-benefício'
		filters.push(
			{ key: 'category', label: 'Categoria: Econômico', value: 'economico' },
			{ key: 'priceMax', label: 'Preço máximo: R$ 80k', value: '80000' }
		)
	} else if (query.includes('família') || query.includes('familiar') || query.includes('espaço')) {
		interpretation = 'Um carro familiar com muito espaço'
		filters.push(
			{ key: 'category', label: 'Categoria: Familiar', value: 'familia' },
			{ key: 'seats', label: 'Assentos: 5+', value: '5' }
		)
	} else if (query.includes('novo') || query.includes('2023') || query.includes('2024')) {
		interpretation = 'Carros mais novos e recentes'
		filters.push({ key: 'yearMin', label: 'Ano mínimo: 2023', value: '2023' })
	} else {
		interpretation = `Busca personalizada: "${searchQuery.value}"`
	}

	aiInterpretation.value = interpretation
	suggestedFilters.value = filters
	isProcessing.value = false
}

const clearAIInterpretation = () => {
	aiInterpretation.value = ''
	suggestedFilters.value = []
}

const handleBlur = () => {
	// Delay hiding to allow click events on suggestions
	setTimeout(() => {
		showSuggestions.value = false
	}, 200)
}

const clearSearch = () => {
	searchQuery.value = ''
	clearAIInterpretation()
	emit('search', '')
}

const selectCategory = (category: Category) => {
	searchQuery.value = category.query
	showSuggestions.value = false
	emit('apply-filters', category.filters)
	emit('search', category.query)
}

const selectSuggestion = (suggestion: Suggestion) => {
	searchQuery.value = suggestion.text
	showSuggestions.value = false
	emit('apply-filters', suggestion.filters)
	emit('search', suggestion.text)
}

const applyAIFilters = () => {
	const filters: Record<string, any> = {}
	suggestedFilters.value.forEach(filter => {
		filters[filter.key] = filter.value
	})

	showSuggestions.value = false
	emit('apply-filters', filters)
	emit('search', searchQuery.value)
}

// Expose search functionality
defineExpose({
	focus: () => {
		const input = document.querySelector('input')
		input?.focus()
	},
	clear: clearSearch
})
</script>

<style scoped>
/* Custom scrollbar for suggestions */
.overflow-y-auto::-webkit-scrollbar {
	width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
	background: #f1f1f1;
	border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
	background: #c1c1c1;
	border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
	background: #a8a8a8;
}
</style>
