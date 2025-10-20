<template>
	<div
		class="goal-card group relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 to-zinc-800 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
	>
		<div
			class="absolute right-0 top-0 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl transition-all group-hover:bg-amber-500/20"
		></div>

		<div class="relative p-6">
			<div class="mb-4 flex items-start gap-4">
				<div v-if="goal.photo" class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg">
					<img
						:src="goal.photo"
						:alt="`${goal.brand} ${goal.model}`"
						class="h-full w-full object-cover"
					/>
				</div>

				<div class="flex-1">
					<div class="mb-1 text-sm font-medium text-zinc-400">{{ goal.brand }}</div>
					<h3 class="mb-2 text-xl font-bold text-white">{{ goal.model }}</h3>
					<span v-if="goal.year" class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
						{{ goal.year }}
					</span>
				</div>

				<button
					class="flex-shrink-0 text-amber-400 transition-colors hover:text-amber-300"
					@click="$emit('remove', goal.id)"
					title="Remover objetivo"
				>
					<Icon name="heroicons:x-mark" class="h-6 w-6" />
				</button>
			</div>

			<div class="mb-4 space-y-3">
				<div>
					<div class="mb-1 text-sm text-zinc-400">Valor FIPE Médio</div>
					<div class="text-xl font-bold text-white">{{ formatCurrency(goal.avgFipeValue) }}</div>
				</div>

				<div v-if="goal.targetPrice">
					<div class="mb-1 text-sm text-zinc-400">Seu Objetivo</div>
					<div class="flex items-baseline gap-2">
						<div class="text-xl font-bold text-amber-400">
							{{ formatCurrency(goal.targetPrice) }}
						</div>
						<div v-if="priceDistance" class="text-sm" :class="priceDistanceClass">
							{{ priceDistance > 0 ? '-' : '+' }}{{ Math.abs(priceDistance).toFixed(1) }}%
						</div>
					</div>
				</div>

				<div v-if="goal.savedAds.length > 0" class="flex items-center gap-2 text-sm text-blue-400">
					<Icon name="heroicons:bookmark-solid" class="h-4 w-4" />
					{{ goal.savedAds.length }} anúncio{{ goal.savedAds.length !== 1 ? 's' : '' }} salvo{{
						goal.savedAds.length !== 1 ? 's' : ''
					}}
				</div>
			</div>

			<div
				v-if="goal.variationAlerts"
				class="mb-4 flex items-center gap-2 rounded-lg bg-amber-900/20 p-3"
			>
				<Icon name="heroicons:bell" class="h-5 w-5 text-amber-400" />
				<span class="text-sm text-amber-300">Monitorando variações de preço</span>
			</div>

			<div class="flex flex-wrap gap-2">
				<button
					class="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
					@click="$emit('viewAds', goal.carModelSlug)"
				>
					<Icon name="heroicons:magnifying-glass" class="h-4 w-4" />
					Ver Anúncios
				</button>

				<button
					class="flex items-center gap-2 rounded-lg bg-zinc-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-600"
					@click="$emit('compare', goal.carModelSlug)"
				>
					<Icon name="heroicons:arrows-right-left" class="h-4 w-4" />
					Comparar
				</button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageGoal } from '@/schemas/garage'

const props = defineProps<{
	goal: GarageGoal
}>()

defineEmits<{
	remove: [id: string]
	viewAds: [slug: string]
	compare: [slug: string]
}>()

const priceDistance = computed(() => {
	if (!props.goal.targetPrice) return null
	const diff = props.goal.avgFipeValue - props.goal.targetPrice
	return (diff / props.goal.targetPrice) * 100
})

const priceDistanceClass = computed(() => {
	if (!priceDistance.value) return 'text-zinc-400'
	if (priceDistance.value > 0) return 'text-red-400'
	return 'text-emerald-400'
})

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}
</script>
