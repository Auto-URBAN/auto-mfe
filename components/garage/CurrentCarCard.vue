<template>
	<div
		class="current-car-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
	>
		<div
			class="absolute right-0 top-0 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl transition-all group-hover:bg-blue-500/20"
		/>

		<div class="relative p-6">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<div class="mb-1 text-sm font-medium text-zinc-400">{{ car.brand }}</div>
					<h3 class="mb-2 text-2xl font-bold text-white">{{ car.model }}</h3>
					<div class="flex flex-wrap gap-2">
						<span class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{{
							car.year
						}}</span>
						<span class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">{{
							formatKm(car.km)
						}}</span>
						<span
							v-if="car.plateVerified"
							class="rounded-full bg-emerald-900/30 px-3 py-1 text-xs text-emerald-400"
						>
							✓ Placa Verificada
						</span>
					</div>
				</div>

				<div
					v-if="car.photos && car.photos.length > 0"
					class="h-24 w-24 overflow-hidden rounded-lg"
				>
					<img
						:src="car.photos[0]"
						:alt="`${car.brand} ${car.model}`"
						class="h-full w-full object-cover"
					/>
				</div>
			</div>

			<div class="mb-4 grid grid-cols-2 gap-4">
				<div>
					<div class="mb-1 text-sm text-zinc-400">Valor FIPE Atual</div>
					<div class="text-2xl font-bold text-blue-400">{{ formatCurrency(car.fipeValue) }}</div>
				</div>

				<div>
					<div class="mb-1 text-sm text-zinc-400">Variação 12 meses</div>
					<div class="text-2xl font-bold" :class="variationClass">
						{{ car.variation12m >= 0 ? '+' : '' }}{{ car.variation12m.toFixed(1) }}%
					</div>
				</div>
			</div>

			<div v-if="car.mods && car.mods.length > 0" class="mb-4">
				<div class="mb-2 text-sm font-medium text-zinc-400">Modificações</div>
				<div class="flex flex-wrap gap-2">
					<span
						v-for="mod in car.mods"
						:key="mod.description"
						class="rounded-full bg-red-900/30 px-3 py-1 text-xs text-red-400"
					>
						{{ mod.description }}
					</span>
				</div>
			</div>

			<div v-if="car.notes" class="mb-4 rounded-lg bg-zinc-800/50 p-3">
				<p class="text-sm italic text-zinc-300">"{{ car.notes }}"</p>
			</div>

			<div class="flex flex-wrap gap-2">
				<button
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					@click="$emit('edit', car.id)"
				>
					<Icon name="heroicons:pencil-square" class="h-4 w-4" />
					Editar
				</button>

				<button
					class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
					@click="$emit('viewHistory', car.id)"
				>
					<Icon name="heroicons:chart-bar" class="h-4 w-4" />
					Histórico FIPE
				</button>

				<button
					class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
					@click="$emit('moveToHistory', car.id)"
				>
					<Icon name="heroicons:clock" class="h-4 w-4" />
					Mover para História
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageCurrentCar } from '@/schemas/garage'

const props = defineProps<{
	car: GarageCurrentCar
}>()

defineEmits<{
	edit: [id: string]
	viewHistory: [id: string]
	moveToHistory: [id: string]
}>()

const variationClass = computed(() => {
	const variation = props.car.variation12m
	if (variation > 0) return 'text-emerald-400'
	if (variation < 0) return 'text-red-400'
	return 'text-zinc-400'
})

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function formatKm(km: number): string {
	return `${km.toLocaleString('pt-BR')} km`
}
</script>
