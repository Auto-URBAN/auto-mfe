<template>
	<div
		class="garage-header relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 p-8 shadow-2xl"
	>
		<div class="absolute inset-0 bg-[url('/textures/honeycomb.svg')] opacity-5" />

		<div class="relative z-10">
			<div class="mb-6">
				<h1 class="mb-2 text-4xl font-bold text-white">{{ greeting }}, {{ userName }}.</h1>
				<p class="text-lg text-zinc-400">{{ subtitle }}</p>
			</div>

			<div class="grid grid-cols-2 gap-4 md:grid-cols-5">
				<div class="rounded-xl bg-zinc-800/50 p-4 backdrop-blur-sm">
					<div class="mb-1 text-sm text-zinc-400">Carros Atuais</div>
					<div class="text-2xl font-bold text-blue-400">{{ totalCars }}</div>
				</div>

				<div class="rounded-xl bg-zinc-800/50 p-4 backdrop-blur-sm">
					<div class="mb-1 text-sm text-zinc-400">Valor Total</div>
					<div class="text-2xl font-bold text-emerald-400">{{ formatCurrency(totalValue) }}</div>
				</div>

				<div class="rounded-xl bg-zinc-800/50 p-4 backdrop-blur-sm">
					<div class="mb-1 text-sm text-zinc-400">Valorização 12m</div>
					<div class="text-2xl font-bold" :class="variationClass">
						{{ avgVariation >= 0 ? '+' : '' }}{{ avgVariation.toFixed(1) }}%
					</div>
				</div>

				<div class="rounded-xl bg-zinc-800/50 p-4 backdrop-blur-sm">
					<div class="mb-1 text-sm text-zinc-400">Histórico</div>
					<div class="text-2xl font-bold text-zinc-300">{{ totalHistory }}</div>
				</div>

				<div class="rounded-xl bg-zinc-800/50 p-4 backdrop-blur-sm">
					<div class="mb-1 text-sm text-zinc-400">Objetivos</div>
					<div class="text-2xl font-bold text-amber-400">{{ totalGoals }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
const props = defineProps<{
	userName?: string
	totalCars: number
	totalValue: number
	avgVariation: number
	totalHistory: number
	totalGoals: number
}>()

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

const variationClass = computed(() => {
	if (props.avgVariation > 0) return 'text-emerald-400'
	if (props.avgVariation < 0) return 'text-red-400'
	return 'text-zinc-400'
})

function formatCurrency(value: number): string {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}
</script>
