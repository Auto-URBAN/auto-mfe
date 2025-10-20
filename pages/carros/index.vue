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
					<div class="mb-6">
						<div class="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
							<div
								v-if="selectedModels.length > 0"
								class="mb-4 flex items-center gap-4 text-sm justify-between"
							>
								<div class="flex items-center gap-4">
									<span class="text-gray-700 font-medium">Campos:</span>
									<div class="flex flex-wrap gap-3">
										<label
											v-for="field in comparisonFields"
											:key="field.id"
											class="flex items-center gap-2 cursor-pointer"
										>
											<input
												v-model="field.enabled"
												type="checkbox"
												class="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
											/>
											<span class="text-gray-700 text-xs">{{ field.label }}</span>
										</label>
									</div>
								</div>

								<UiButton
									v-if="selectedModels.length > 0"
									variant="outline"
									size="sm"
									@click="clearSelection"
								>
									<Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-1" />
									Limpar
								</UiButton>
							</div>

							<div
								v-if="selectedModels.length > 0"
								class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
							>
								<div
									v-for="model in selectedModels"
									:key="model.id"
									class="bg-white rounded-lg p-4 relative group border border-gray-200"
								>
									<button
										class="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
										@click="removeModel(model.id)"
									>
										<Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 text-white" />
									</button>

									<div class="aspect-video overflow-hidden rounded-lg mb-3">
										<img
											:src="model.coverImageUrl"
											:alt="model.title"
											class="w-full h-full object-cover"
										/>
									</div>

									<p class="text-xs text-gray-500 font-medium mb-1">{{ model.brand }}</p>
									<h4 class="text-sm font-bold text-gray-900 mb-2 truncate">
										{{ model.model }}
									</h4>
									<p class="text-lg font-bold text-green-600 mb-3">
										{{ formatCurrency(model.price) }}
									</p>

									<div class="space-y-2 text-xs">
										<div
											v-if="getFieldEnabled('horsepower')"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon name="heroicons:bolt-20-solid" class="w-3.5 h-3.5 text-orange-500" />
												<span>Potência</span>
											</div>
											<span class="font-bold text-gray-900">{{ model.horsepower }} cv</span>
										</div>
										<div
											v-if="getFieldEnabled('year')"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon
													name="heroicons:calendar-20-solid"
													class="w-3.5 h-3.5 text-blue-500"
												/>
												<span>Ano</span>
											</div>
											<span class="font-bold text-gray-900">{{ model.year }}</span>
										</div>
										<div
											v-if="getFieldEnabled('transmission') && (model as any).transmission"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon
													name="heroicons:cog-6-tooth-20-solid"
													class="w-3.5 h-3.5 text-indigo-500"
												/>
												<span>Câmbio</span>
											</div>
											<span class="font-bold text-gray-900">{{ (model as any).transmission }}</span>
										</div>
										<div
											v-if="getFieldEnabled('fuel') && (model as any).fuel"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon name="heroicons:fire-20-solid" class="w-3.5 h-3.5 text-red-500" />
												<span>Combustível</span>
											</div>
											<span class="font-bold text-gray-900">{{ (model as any).fuel }}</span>
										</div>
										<div
											v-if="getFieldEnabled('maintenanceCost')"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon
													name="heroicons:wrench-screwdriver-20-solid"
													class="w-3.5 h-3.5 text-yellow-600"
												/>
												<span>Manutenção</span>
											</div>
											<div class="flex items-center gap-1">
												<span class="font-bold text-gray-900">{{ getMaintenanceCost(model) }}</span>
												<span class="text-gray-500">/10</span>
											</div>
										</div>
										<div
											v-if="getFieldEnabled('insuranceCost')"
											class="flex items-center justify-between py-1.5 border-t border-gray-100"
										>
											<div class="flex items-center gap-1.5 text-gray-600">
												<Icon
													name="heroicons:shield-check-20-solid"
													class="w-3.5 h-3.5 text-green-600"
												/>
												<span>Seguro</span>
											</div>
											<span class="font-bold text-gray-900">{{
												formatCurrency(getInsuranceCost(model))
											}}</span>
										</div>
										<div
											v-if="getFieldEnabled('depreciation')"
											class="border-t border-gray-100 pt-3 mt-2"
										>
											<div class="flex items-center gap-1.5 text-gray-600 mb-2">
												<Icon
													name="heroicons:chart-bar-20-solid"
													class="w-3.5 h-3.5 text-purple-600"
												/>
												<span class="text-xs">Depreciação 5 Anos</span>
											</div>
											<div class="h-20">
												<Chart
													type="line"
													:data="getDepreciationData(model)"
													:options="depreciationChartOptions"
													:height="80"
												/>
											</div>
										</div>
									</div>

									<NuxtLink :to="`/carros/${model.slug}`" class="block mt-4">
										<UiButton variant="outline" size="sm" class="w-full hover:bg-gray-50">
											Ver Detalhes
										</UiButton>
									</NuxtLink>
								</div>
							</div>

							<div v-else class="text-center py-12">
								<div class="max-w-md mx-auto">
									<div
										class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"
									>
										<Icon
											name="heroicons:cursor-arrow-ripple-20-solid"
											class="w-8 h-8 text-gray-300"
										/>
									</div>
									<p class="text-gray-400 text-sm">
										Clique nos cards abaixo para adicionar modelos à comparação
									</p>
								</div>
							</div>
						</div>
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

// Get query params to auto-select a model
const route = useRoute()
const slugParam = route.query.slug as string | undefined

const comparisonFields = ref([
	{ id: 'horsepower', label: 'Potência', enabled: true },
	{ id: 'year', label: 'Ano', enabled: true },
	{ id: 'transmission', label: 'Câmbio', enabled: false },
	{ id: 'fuel', label: 'Combustível', enabled: false },
	{ id: 'maintenanceCost', label: 'Custo Manutenção', enabled: true },
	{ id: 'insuranceCost', label: 'Custo Seguro', enabled: true },
	{ id: 'depreciation', label: 'Depreciação 5 Anos', enabled: true }
])

function getFieldEnabled(fieldId: string): boolean {
	return comparisonFields.value.find(f => f.id === fieldId)?.enabled || false
}

// Calculate maintenance cost based on brand and horsepower (1-10 scale)
function getMaintenanceCost(model: VehicleSummary): number {
	const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi', 'Volvo', 'Land Rover']
	const popularBrands = ['Volkswagen', 'Chevrolet', 'Fiat', 'Renault', 'Ford', 'Toyota', 'Honda']

	let cost = 5 // Base cost

	// Adjust by brand
	if (luxuryBrands.includes(model.brand)) {
		cost += 3
	} else if (popularBrands.includes(model.brand)) {
		cost -= 1
	}

	// Adjust by horsepower
	if (model.horsepower > 300) cost += 2
	else if (model.horsepower > 200) cost += 1
	else if (model.horsepower < 100) cost -= 1

	return Math.min(10, Math.max(1, cost))
}

// Calculate insurance cost based on price and horsepower
function getInsuranceCost(model: VehicleSummary): number {
	const baseRate = 0.04 // 4% of vehicle value
	let multiplier = 1

	// Higher horsepower = higher insurance
	if (model.horsepower > 250) multiplier = 1.5
	else if (model.horsepower > 150) multiplier = 1.2
	else if (model.horsepower < 100) multiplier = 0.8

	return model.price * baseRate * multiplier
}

// Generate depreciation data for the last 5 years
function getDepreciationData(model: VehicleSummary) {
	const currentYear = new Date().getFullYear()
	const years = []
	const values = []

	// Calculate depreciation rate based on brand
	const luxuryBrands = ['BMW', 'Mercedes-Benz', 'Porsche', 'Audi']
	const depreciationRate = luxuryBrands.includes(model.brand) ? 0.15 : 0.12 // 15% vs 12% per year

	for (let i = 0; i <= 5; i++) {
		years.push((currentYear - 5 + i).toString())
		const value = model.price * Math.pow(1 - depreciationRate, 5 - i)
		values.push(Math.round(value))
	}

	return {
		labels: years,
		datasets: [
			{
				data: values,
				borderColor: '#8b5cf6',
				backgroundColor: 'transparent',
				tension: 0.3,
				borderWidth: 2,
				pointRadius: 0
			}
		]
	}
}

const depreciationChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		},
		tooltip: {
			enabled: true,
			callbacks: {
				label: (context: { parsed: { y: number } }) => {
					return formatCurrency(context.parsed.y)
				}
			}
		}
	},
	scales: {
		x: {
			display: false
		},
		y: {
			display: false
		}
	}
}

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
			// Group by model to avoid duplicates
			const modelsMap = new Map()
			response.items.forEach((vehicle: VehicleSummary) => {
				const key = `${vehicle.brand}-${vehicle.model}`
				if (!modelsMap.has(key)) {
					modelsMap.set(key, vehicle)
				}
			})
			allModels.value = Array.from(modelsMap.values())
			filterModels()

			// Auto-select model from query param
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

// Handle sidebar filter updates
function handleFilterUpdate(filters: Partial<SearchFilters> & { category?: string }) {
	sidebarFilters.value = filters
	loadModels()
}

// Apply category filters from sidebar
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
					return false // Placeholder - adicionar quando houver campo fuel
				default:
					return true
			}
		})
	}

	filteredModels.value = results
}

// Selection management
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

// Formatters
function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

onMounted(() => {
	loadModels()
})
</script>
