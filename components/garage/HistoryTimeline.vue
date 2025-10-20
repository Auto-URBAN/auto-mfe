<template>
	<div class="history-timeline space-y-6">
		<div
			v-for="car in sortedCars"
			:key="car.id"
			class="history-card group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-800 to-zinc-900 transition-all duration-300 hover:scale-[1.01]"
		>
			<div class="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-zinc-600 to-zinc-800" />

			<div class="relative p-6 pl-8 grayscale transition-all duration-300 hover:grayscale-0">
				<div class="mb-4 flex items-start justify-between">
					<div class="flex-1">
						<div class="mb-1 flex items-center gap-3">
							<span class="text-sm font-medium text-zinc-500">
								{{ formatDate(car.purchaseDate) }}
								<span v-if="car.sellDate"> → {{ formatDate(car.sellDate) }}</span>
							</span>
							<span
								:class="statusBadgeClass(car.status)"
								class="rounded-full px-3 py-1 text-xs font-medium"
							>
								{{ statusLabel(car.status) }}
							</span>
						</div>

						<h3 class="mb-2 text-xl font-bold text-white">
							{{ car.brand }} {{ car.model }} {{ car.year }}
						</h3>

						<div class="mb-3 flex flex-wrap gap-2 text-sm text-zinc-400">
							<span>{{ formatKm(car.kmStart) }} → {{ formatKm(car.kmEnd || car.kmStart) }}</span>
							<span v-if="car.color">• {{ car.color }}</span>
							<span v-if="car.mods.length > 0">• {{ car.mods.length }} modificações</span>
						</div>

						<div v-if="car.storyNote" class="mb-4 rounded-lg bg-zinc-900/50 p-3">
							<p class="text-sm italic text-zinc-300">"{{ car.storyNote }}"</p>
						</div>

						<div class="grid grid-cols-3 gap-4">
							<div>
								<div class="text-xs text-zinc-500">Compra</div>
								<div class="font-semibold text-zinc-300">
									{{ formatCurrency(car.purchasePrice) }}
								</div>
							</div>

							<div v-if="car.sellPrice">
								<div class="text-xs text-zinc-500">Venda</div>
								<div class="font-semibold text-zinc-300">{{ formatCurrency(car.sellPrice) }}</div>
							</div>

							<div v-if="car.profitLoss !== undefined">
								<div class="text-xs text-zinc-500">Resultado</div>
								<div class="font-semibold" :class="profitLossClass(car.profitLoss)">
									{{ car.profitLoss >= 0 ? '+' : '' }}{{ formatCurrency(Math.abs(car.profitLoss)) }}
								</div>
							</div>
						</div>
					</div>

					<div
						v-if="car.photos && car.photos.length > 0"
						class="ml-4 h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg"
					>
						<img
							:src="car.photos[0]"
							:alt="`${car.brand} ${car.model}`"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>

				<div v-if="car.mods.length > 0" class="flex flex-wrap gap-2">
					<span
						v-for="mod in car.mods"
						:key="mod.description"
						class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
					>
						{{ mod.description }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageHistoryCar, CarHistoryStatus } from '@/schemas/garage'

const props = defineProps<{
	cars: GarageHistoryCar[]
}>()

const sortedCars = computed(() => {
	return [...props.cars].sort((a, b) => {
		const dateA = a.sellDate || a.purchaseDate
		const dateB = b.sellDate || b.purchaseDate
		return dateB.getTime() - dateA.getTime()
	})
})

function formatDate(date: Date): string {
	return new Intl.DateTimeFormat('pt-BR', {
		month: 'short',
		year: 'numeric'
	}).format(date)
}

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

function statusLabel(status: CarHistoryStatus): string {
	const labels: Record<CarHistoryStatus, string> = {
		SOLD: 'Vendido',
		CRASHED: 'Acidentado',
		STOLEN: 'Roubado',
		DONATED: 'Doado',
		TOTALED: 'Perda Total'
	}
	return labels[status]
}

function statusBadgeClass(status: CarHistoryStatus): string {
	const classes: Record<CarHistoryStatus, string> = {
		SOLD: 'bg-emerald-900/30 text-emerald-400',
		CRASHED: 'bg-red-900/30 text-red-400',
		STOLEN: 'bg-orange-900/30 text-orange-400',
		DONATED: 'bg-blue-900/30 text-blue-400',
		TOTALED: 'bg-red-900/30 text-red-400'
	}
	return classes[status]
}

function profitLossClass(value: number): string {
	if (value > 0) return 'text-emerald-400'
	if (value < 0) return 'text-red-400'
	return 'text-zinc-400'
}
</script>
