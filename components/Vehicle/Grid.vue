<template>
	<div class="w-full">
		<div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			<div v-for="n in skeletonCount" :key="n" class="bg-white rounded-lg border animate-pulse">
				<div class="aspect-[4/3] bg-gray-200 rounded-t-lg" />
				<div class="p-4 space-y-3">
					<div class="h-4 bg-gray-200 rounded w-3/4" />
					<div class="h-6 bg-gray-200 rounded w-1/2" />
					<div class="flex gap-2">
						<div class="h-5 bg-gray-200 rounded w-16" />
						<div class="h-5 bg-gray-200 rounded w-20" />
					</div>
					<div class="h-4 bg-gray-200 rounded w-2/3" />
					<div class="h-8 bg-gray-200 rounded" />
				</div>
			</div>
		</div>

		<div
			v-else-if="vehicles.length > 0"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
		>
			<VehicleCard
				v-for="vehicle in vehicles"
				:key="vehicle.id"
				:title="vehicle.title"
				:href="`/carros?slug=${vehicle.slug}`"
				:cover-image-url="vehicle.coverImageUrl"
				:brand="vehicle.brand"
			/>
		</div>

		<div v-else class="text-center py-12">
			<Icon
				name="heroicons:magnifying-glass-20-solid"
				class="w-16 h-16 text-gray-300 mx-auto mb-4"
			/>
			<h3 class="text-lg font-medium text-gray-900 mb-2">Nenhum veículo encontrado</h3>
			<p class="text-gray-500 mb-4">Tente ajustar os filtros ou buscar por outros termos.</p>
			<UiButton variant="outline" @click="$emit('clearFilters')"> Limpar filtros </UiButton>
		</div>

		<div v-if="vehicles.length > 0 && hasMore && !loading" class="text-center mt-8">
			<UiButton :loading="loadingMore" variant="outline" size="lg" @click="$emit('loadMore')">
				{{ loadingMore ? 'Carregando...' : 'Carregar mais veículos' }}
			</UiButton>
		</div>

		<div v-if="!loading && vehicles.length > 0" class="text-center mt-6 text-sm text-gray-500">
			Exibindo {{ vehicles.length }} de {{ totalResults }} veículos
		</div>
	</div>
</template>

<script setup lang="ts">
import type { VehicleSummary } from '@/schemas/vehicle'

interface Props {
	vehicles: VehicleSummary[]
	loading?: boolean
	loadingMore?: boolean
	hasMore?: boolean
	totalResults?: number
	skeletonCount?: number
}

interface Emits {
	loadMore: []
	clearFilters: []
}

withDefaults(defineProps<Props>(), {
	loading: false,
	loadingMore: false,
	hasMore: false,
	totalResults: 0,
	skeletonCount: 8
})

defineEmits<Emits>()
</script>
