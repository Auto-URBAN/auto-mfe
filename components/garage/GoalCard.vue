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
					<span
						v-if="goal.yearMin || goal.yearMax"
						class="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300"
					>
						<span v-if="goal.yearMin && goal.yearMax">{{ goal.yearMin }}-{{ goal.yearMax }}</span>
						<span v-else-if="goal.yearMin">{{ goal.yearMin }}+</span>
						<span v-else>até {{ goal.yearMax }}</span>
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
				<!-- Valor FIPE não disponível no UserWishlist -->
				<div v-if="goal.targetPriceMin || goal.targetPriceMax">
					<div class="mb-1 text-sm text-zinc-400">Faixa de Preço</div>
					<div class="text-xl font-bold text-amber-400">
						<span v-if="goal.targetPriceMin && goal.targetPriceMax">
							{{ formatCurrency(goal.targetPriceMin) }} - {{ formatCurrency(goal.targetPriceMax) }}
						</span>
						<span v-else-if="goal.targetPriceMin">
							A partir de {{ formatCurrency(goal.targetPriceMin) }}
						</span>
						<span v-else-if="goal.targetPriceMax">
							Até {{ formatCurrency(goal.targetPriceMax) }}
						</span>
					</div>
				</div>
				<!-- Informação de anúncios salvos será implementada futuramente -->
			</div>

			<div
				v-if="goal.notificationsEnabled"
				class="mb-4 flex items-center gap-2 rounded-lg bg-amber-900/20 p-3"
			>
				<Icon name="heroicons:bell" class="h-5 w-5 text-amber-400" />
				<span class="text-sm text-amber-300">Notificações ativadas</span>
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
					class="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
					@click="$emit('achieved', goal)"
				>
					<Icon name="heroicons:check-circle" class="h-4 w-4" />
					Objetivo Alcançado
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
import type { UserWishlist } from '@/schemas/wishlist'

const props = defineProps<{
	goal: UserWishlist
}>()

defineEmits<{
	remove: [id: string]
	viewAds: [slug: string]
	compare: [slug: string]
	achieved: [goal: UserWishlist]
}>()

// Removed price distance calculations as UserWishlist doesn't have avgFipeValue and targetPrice

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}
</script>
