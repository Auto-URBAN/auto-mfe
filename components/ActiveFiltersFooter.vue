<template>
	<div
		v-if="hasActiveFilters"
		class="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-40"
	>
		<div class="max-w-7xl mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="flex items-center gap-2">
						<Icon name="heroicons:funnel-20-solid" class="w-4 h-4 text-blue-600" />
						<span class="text-sm font-medium text-gray-700">Filtros ativos:</span>
					</div>

					<div class="flex flex-wrap gap-2">
						<div
							v-for="brand in activeBrands"
							:key="`brand-${brand}`"
							class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
						>
							<span>{{ brand }}</span>
							<button @click="removeBrand(brand)" class="ml-2 hover:bg-blue-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-for="model in activeModels"
							:key="`model-${model}`"
							class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
						>
							<span>{{ model }}</span>
							<button @click="removeModel(model)" class="ml-2 hover:bg-purple-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-for="year in activeYears"
							:key="`year-${year}`"
							class="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
						>
							<span>{{ year }}</span>
							<button @click="removeYear(year)" class="ml-2 hover:bg-orange-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-for="color in activeColors"
							:key="`color-${color}`"
							class="inline-flex items-center px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
						>
							<span>{{ color }}</span>
							<button @click="removeColor(color)" class="ml-2 hover:bg-pink-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-if="activePriceRange"
							class="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
						>
							<span>{{ activePriceRange }}</span>
							<button @click="removePriceRange()" class="ml-2 hover:bg-green-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-if="filters.make"
							class="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
						>
							<span>{{ filters.make }}</span>
							<button @click="removeFilter('make')" class="ml-2 hover:bg-blue-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-if="filters.model"
							class="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
						>
							<span>{{ filters.model }}</span>
							<button
								@click="removeFilter('model')"
								class="ml-2 hover:bg-purple-200 rounded-full p-1"
							>
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>

						<div
							v-if="filters.uf"
							class="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
						>
							<span>{{ filters.uf }}</span>
							<button @click="removeFilter('uf')" class="ml-2 hover:bg-gray-200 rounded-full p-1">
								<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
							</button>
						</div>
					</div>
				</div>

				<UiButton @click="clearAllFilters" variant="outline" size="sm" class="flex-shrink-0">
					<Icon name="heroicons:x-mark-20-solid" class="w-4 h-4 mr-1" />
					Limpar tudo
				</UiButton>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	filters: Record<string, any>
	activeBrands?: string[]
	activeModels?: string[]
	activeYears?: number[]
	activeColors?: string[]
	activePriceRange?: string
}

interface Emits {
	(e: 'update:filters', filters: Record<string, any>): void
	(e: 'remove-brand', brand: string): void
	(e: 'remove-model', model: string): void
	(e: 'remove-year', year: number): void
	(e: 'remove-color', color: string): void
	(e: 'remove-price-range'): void
	(e: 'clear-all'): void
}

const props = withDefaults(defineProps<Props>(), {
	activeBrands: () => [],
	activeModels: () => [],
	activeYears: () => [],
	activeColors: () => [],
	activePriceRange: undefined
})

const emit = defineEmits<Emits>()

const hasActiveFilters = computed(() => {
	return (
		props.activeBrands.length > 0 ||
		props.activeModels.length > 0 ||
		props.activeYears.length > 0 ||
		props.activeColors.length > 0 ||
		props.activePriceRange ||
		Object.keys(props.filters).some(key => {
			const value = props.filters[key]
			return value && value !== '' && key !== 'sort'
		})
	)
})

const removeFilter = (key: string) => {
	const newFilters = { ...props.filters }
	newFilters[key] = ''
	emit('update:filters', newFilters)
}

const removeBrand = (brand: string) => {
	emit('remove-brand', brand)
}

const removeModel = (model: string) => {
	emit('remove-model', model)
}

const removeYear = (year: number) => {
	emit('remove-year', year)
}

const removeColor = (color: string) => {
	emit('remove-color', color)
}

const removePriceRange = () => {
	emit('remove-price-range')
}

const clearAllFilters = () => {
	emit('clear-all')
}
</script>
