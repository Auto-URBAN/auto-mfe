<template>
	<div class="min-h-screen bg-gray-50">
		<div class="bg-white border-b">
			<UiContainer size="xl" padding="md" class="py-12">
				<div class="flex items-center justify-between">
					<div class="flex-1">
						<div class="flex items-center gap-3 mb-3">
							<div
								class="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
							>
								<Icon name="heroicons:arrows-right-left-20-solid" class="w-6 h-6 text-white" />
							</div>
							<div>
								<UiText as="h1" size="3xl" weight="bold" class="mb-1">
									Comparador de Modelos
								</UiText>
								<div class="flex items-center gap-2 text-sm text-gray-500">
									<Icon name="heroicons:information-circle-20-solid" class="w-4 h-4" />
									<span>Compare especificações técnicas e preços FIPE</span>
								</div>
							</div>
						</div>
					</div>

					<div class="hidden md:flex items-center gap-6">
						<div class="text-center px-4 py-2 bg-blue-50 rounded-lg">
							<div class="text-2xl font-bold text-blue-600">{{ filteredModels.length }}</div>
							<div class="text-xs text-gray-600">Modelos</div>
						</div>
						<div class="text-center px-4 py-2 bg-purple-50 rounded-lg">
							<div class="text-2xl font-bold text-purple-600">{{ selectedModels.length }}/4</div>
							<div class="text-xs text-gray-600">Comparando</div>
						</div>
					</div>
				</div>
			</UiContainer>
		</div>

		<UiContainer size="xl" padding="md" class="py-8">
			<div class="flex gap-6">
				<div class="hidden lg:block w-80 flex-shrink-0">
					<div class="sticky top-6">
						<VehicleFilterSidebar mode="models" @update:filters="handleFilterUpdate" />
					</div>
				</div>

				<div class="flex-1 min-w-0">
					<div v-if="selectedModels.length > 0" class="mb-6">
						<VehicleComparator
							:selected-vehicles="selectedModels"
							mode="models"
							@remove="removeModel"
							@clear="clearSelection"
						/>
					</div>

					<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div v-for="i in 6" :key="i" class="bg-white rounded-xl p-6 animate-pulse">
							<div class="aspect-video bg-gray-200 rounded-lg mb-4" />
							<div class="h-6 bg-gray-200 rounded mb-2" />
							<div class="h-4 bg-gray-200 rounded w-2/3" />
						</div>
					</div>

					<div
						v-else-if="filteredModels.length > 0"
						class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
					>
						<div v-for="model in filteredModels" :key="model.id" class="relative">
							<button
								:class="[
									'absolute top-3 left-3 z-10 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 border-2 shadow-md',
									isSelected(model.id)
										? 'bg-blue-600 border-blue-600 scale-110'
										: 'bg-white/95 backdrop-blur-sm border-gray-300 hover:border-blue-500 hover:scale-105'
								]"
								:disabled="!isSelected(model.id) && selectedModels.length >= 4"
								@click.prevent="toggleSelection(model)"
							>
								<Icon
									v-if="isSelected(model.id)"
									name="heroicons:check-20-solid"
									class="w-5 h-5 text-white"
								/>
								<Icon
									v-else
									name="heroicons:plus-20-solid"
									:class="[
										'w-5 h-5',
										selectedModels.length >= 4 ? 'text-gray-400' : 'text-gray-700'
									]"
								/>
							</button>

							<VehicleCard
								:title="`${model.brand} ${model.model}`"
								:href="`/carros/${model.slug}`"
								:cover-image-url="model.coverImageUrl"
								:brand="model.brand"
								:price="model.price"
								:year="model.year"
								:horsepower="model.horsepower"
								:featured="model.featured"
								:show-specs="true"
								price-label="Preço médio FIPE"
							/>
						</div>
					</div>

					<div v-else class="text-center py-16">
						<Icon
							name="heroicons:magnifying-glass-20-solid"
							class="w-20 h-20 text-gray-300 mx-auto mb-4"
						/>
						<h3 class="text-xl font-semibold text-gray-900 mb-2">Nenhum modelo encontrado</h3>
						<p class="text-gray-500">Tente ajustar sua busca ou filtros</p>
					</div>

					<div v-if="!loading && filteredModels.length > 0" class="mt-6">
						<p class="text-sm text-gray-600">
							<span class="font-semibold text-gray-900">{{ filteredModels.length }}</span>
							{{ filteredModels.length === 1 ? 'modelo encontrado' : 'modelos encontrados' }}
						</p>
					</div>
				</div>
			</div>
		</UiContainer>
	</div>
</template>

<script setup lang="ts">
import type { VehicleSummary, SearchFilters } from '@/schemas/vehicle'

interface SearchResult {
	items: VehicleSummary[]
	total: number
	page: number
	pageSize: number
}

useHead({
	title: 'Comparador de Modelos - Auto URBAN',
	meta: [
		{
			name: 'description',
			content:
				'Compare até 4 modelos lado a lado: especificações, preços, potência e características técnicas.'
		}
	]
})

const loading = ref(true)
const allModels = ref<VehicleSummary[]>([])
const filteredModels = ref<VehicleSummary[]>([])
const selectedModels = ref<VehicleSummary[]>([])
const sidebarFilters = ref<Partial<SearchFilters> & { category?: string }>({})

const route = useRoute()
const slugParam = route.query.slug as string | undefined

async function loadModels() {
	loading.value = true
	try {
		const queryParams = {
			pageSize: 50,
			...sidebarFilters.value
		}

		const response = await $fetch<SearchResult>('/api/vehicles', {
			query: queryParams
		})

		if (response?.items) {
			const modelsMap = new Map()
			response.items.forEach((vehicle: VehicleSummary) => {
				const key = `${vehicle.brand}-${vehicle.model}`
				if (!modelsMap.has(key)) {
					modelsMap.set(key, vehicle)
				}
			})
			allModels.value = Array.from(modelsMap.values())
			filterModels()

			if (slugParam && selectedModels.value.length === 0) {
				const modelToSelect = allModels.value.find(m => m.slug === slugParam)
				if (modelToSelect) {
					selectedModels.value.push(modelToSelect)
				}
			}
		}
	} catch (error) {
		console.error('Error loading models:', error)
	} finally {
		loading.value = false
	}
}

function handleFilterUpdate(filters: Partial<SearchFilters> & { category?: string }) {
	sidebarFilters.value = filters
	loadModels()
}

function filterModels() {
	let results = [...allModels.value]

	const category = sidebarFilters.value.category || 'todos'

	if (category !== 'todos') {
		results = results.filter(m => {
			switch (category) {
				case 'esportivos':
					return m.horsepower >= 200
				case 'luxo':
					return ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi'].includes(m.brand)
				case 'compactos':
					return m.horsepower < 200 && ['Volkswagen', 'Chevrolet', 'Renault'].includes(m.brand)
				case 'suv':
					return m.model.toLowerCase().includes('suv') || m.model.toLowerCase().includes('x')
				case 'eletricos':
					return false
				default:
					return true
			}
		})
	}

	filteredModels.value = results
}

function isSelected(modelId: string): boolean {
	return selectedModels.value.some(m => m.id === modelId)
}

function toggleSelection(model: VehicleSummary) {
	const index = selectedModels.value.findIndex(m => m.id === model.id)

	if (index > -1) {
		selectedModels.value.splice(index, 1)
	} else if (selectedModels.value.length < 4) {
		selectedModels.value.push(model)
	}
}

function removeModel(modelId: string) {
	selectedModels.value = selectedModels.value.filter(m => m.id !== modelId)
}

function clearSelection() {
	selectedModels.value = []
}

onMounted(() => {
	loadModels()
})
</script>
