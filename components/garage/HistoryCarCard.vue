<template>
	<div
		class="history-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
	>
		<div
			class="absolute right-0 top-0 h-48 w-48 rounded-full bg-zinc-500/10 blur-3xl transition-all group-hover:bg-zinc-500/20"
		/>

		<div class="relative p-6 grayscale transition-all duration-300 hover:grayscale-0">
			<div class="mb-4 flex items-start justify-between">
				<div>
					<div class="mb-1 flex flex-wrap items-center gap-2">
						<span class="text-sm font-medium text-zinc-400">
							{{ formatDate(car.purchaseDate) }}
							<span v-if="car.sellDate"> → {{ formatDate(car.sellDate) }}</span>
						</span>
						<span :class="statusBadgeClass" class="rounded-full px-3 py-1 text-xs font-medium">
							{{ statusLabel }}
						</span>
					</div>

					<h3 class="mb-2 text-2xl font-bold text-white">{{ car.brand }} {{ car.model }}</h3>

					<div class="flex flex-wrap gap-2">
						<span class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
							{{ car.year }}
						</span>
						<span class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
							{{ formatKm(car.kmStart) }} → {{ formatKm(car.kmEnd || car.kmStart) }}
						</span>
						<span v-if="car.color" class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
							{{ car.color }}
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

			<div class="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3">
				<div>
					<div class="mb-1 text-sm text-zinc-400">Compra</div>
					<div class="text-xl font-bold text-zinc-300">
						{{ formatCurrency(car.purchasePrice) }}
					</div>
				</div>

				<div v-if="car.sellPrice">
					<div class="mb-1 text-sm text-zinc-400">Venda</div>
					<div class="text-xl font-bold text-zinc-300">{{ formatCurrency(car.sellPrice) }}</div>
				</div>
			</div>

			<div class="mb-4">
				<div class="mb-2 text-sm font-medium text-zinc-400">Modificações</div>
				<div v-if="car.mods && car.mods.length > 0" class="flex flex-wrap gap-2">
					<span
						v-for="mod in car.mods"
						:key="mod.description"
						class="rounded-full bg-red-900/30 px-3 py-1 text-xs text-red-400"
					>
						{{ mod.description }}
					</span>
				</div>
				<div v-else class="text-sm text-zinc-500">Nenhuma modificação adicionada.</div>
			</div>

			<div v-if="car.storyNote" class="rounded-lg bg-zinc-800/50 p-3">
				<p class="text-sm italic text-zinc-300">"{{ car.storyNote }}"</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageHistoryCar, CarHistoryStatus } from '@/schemas/garage'

const props = defineProps<{
	car: GarageHistoryCar
}>()

const statusLabel = computed(() => {
	const labels: Record<CarHistoryStatus, string> = {
		SOLD: 'Vendido',
		CRASHED: 'Acidentado',
		STOLEN: 'Roubado',
		DONATED: 'Doado',
		TOTALED: 'Perda Total'
	}
	return labels[props.car.status]
})

const statusBadgeClass = computed(() => {
	const classes: Record<CarHistoryStatus, string> = {
		SOLD: 'bg-emerald-900/30 text-emerald-400',
		CRASHED: 'bg-red-900/30 text-red-400',
		STOLEN: 'bg-orange-900/30 text-orange-400',
		DONATED: 'bg-blue-900/30 text-blue-400',
		TOTALED: 'bg-red-900/30 text-red-400'
	}
	return classes[props.car.status]
})

const profitLossClass = computed(() => {
	if (!props.car.profitLoss) return 'text-zinc-400'
	return props.car.profitLoss >= 0 ? 'text-emerald-400' : 'text-red-400'
})

function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date
	return new Intl.DateTimeFormat('pt-BR', {
		month: 'short',
		year: 'numeric'
	}).format(d)
}

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

function formatKm(km: number): string {
	return `${km.toLocaleString('pt-BR')}km`
}
</script>
