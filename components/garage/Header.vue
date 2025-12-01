<template>
	<div
		class="garage-header relative overflow-hidden rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-6 shadow-xl"
	>
		<div class="absolute inset-0 bg-[url('/textures/honeycomb.svg')] opacity-5" />

		<div class="relative z-10 flex gap-6">
			<div class="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
				<div>
					<h1 class="text-2xl font-bold text-white md:text-3xl">{{ greeting }}, {{ userName }}.</h1>
					<p class="text-sm text-zinc-400">{{ subtitle }}</p>
				</div>
			</div>

			<div class="flex-1">
				<div class="grid grid-cols-2 gap-3 md:grid-cols-5">
					<div class="rounded-lg bg-zinc-800/50 p-3 backdrop-blur-sm">
						<div class="mb-0.5 text-xs text-zinc-400">Carros Atuais</div>
						<div class="text-xl font-bold text-blue-400">{{ totalCars }}</div>
					</div>

					<div class="rounded-lg bg-zinc-800/50 p-3 backdrop-blur-sm">
						<div class="mb-0.5 text-xs text-zinc-400">Valor Total</div>
						<div class="text-xl font-bold text-emerald-400">{{ formatCurrency(totalValue) }}</div>
					</div>

					<div class="rounded-lg bg-zinc-800/50 p-3 backdrop-blur-sm">
						<div class="mb-0.5 text-xs text-zinc-400">Valorização 12m</div>
						<div class="text-xl font-bold" :class="variationClass">
							{{ safeAvgVariation >= 0 ? '+' : '' }}{{ (safeAvgVariation || 0).toFixed(1) }}%
						</div>
					</div>

					<div class="rounded-lg bg-zinc-800/50 p-3 backdrop-blur-sm">
						<div class="mb-0.5 text-xs text-zinc-400">Histórico</div>
						<div class="text-xl font-bold text-zinc-300">{{ totalHistory }}</div>
					</div>

					<div class="rounded-lg bg-zinc-800/50 p-3 backdrop-blur-sm">
						<div class="mb-0.5 text-xs text-zinc-400">Objetivos</div>
						<div class="text-xl font-bold text-amber-400">{{ totalGoals }}</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		userName?: string
		totalCars: number
		totalValue: number
		avgVariation: number
		totalHistory: number
		totalGoals: number
	}>(),
	{
		userName: 'Usuário',
		totalCars: 0,
		totalValue: 0,
		avgVariation: 0,
		totalHistory: 0,
		totalGoals: 0
	}
)

const greeting = computed(() => {
	const hour = new Date().getHours()
	if (hour < 12) return 'Bom dia'
	if (hour < 18) return 'Boa tarde'
	return 'Boa noite'
})

const subtitle = computed(() => {
	const subtitles = [
		'Sua história sobre rodas continua.',
		'O mercado respeita — e o coração sente pulsar.',
		'Cada carro conta uma história.',
		'Seu museu pessoal de motores.',
		'Continue escrevendo sua jornada automotiva.'
	]
	return subtitles[Math.floor(Math.random() * subtitles.length)]
})

const safeAvgVariation = computed(() => {
	const value = props.avgVariation
	// Garantir que sempre retornamos um número válido
	if (typeof value !== 'number' || isNaN(value) || value === null || value === undefined) {
		return 0
	}
	return value
})

const variationClass = computed(() => {
	const variation = safeAvgVariation.value
	if (variation > 0) return 'text-emerald-400'
	if (variation < 0) return 'text-red-400'
	return 'text-zinc-400'
})

function formatCurrency(value: number): string {
	const safeValue = isNaN(value) || value === null || value === undefined ? 0 : value
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(safeValue)
}
</script>
