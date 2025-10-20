<template>
	<div class="garage-stats space-y-6">
		<h2 class="text-2xl font-bold text-white">Estatísticas da Garagem</h2>

		<div
			v-if="stats.valueHistory && stats.valueHistory.length > 0"
			class="rounded-xl bg-zinc-900 p-6"
		>
			<h3 class="mb-4 text-lg font-semibold text-white">Evolução do Valor Total</h3>
			<div style="height: 250px">
				<Chart type="line" :data="valueChartData" :options="valueChartOptions" :height="250" />
			</div>
		</div>

		<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
			<div
				v-if="stats.segmentBreakdown && stats.segmentBreakdown.length > 0"
				class="rounded-xl bg-zinc-900 p-6"
			>
				<h3 class="mb-4 text-lg font-semibold text-white">Distribuição por Tipo</h3>
				<div style="height: 200px">
					<Chart type="pie" :data="segmentChartData" :options="segmentChartOptions" :height="200" />
				</div>
			</div>

			<div
				v-if="stats.brandVariation && stats.brandVariation.length > 0"
				class="rounded-xl bg-zinc-900 p-6"
			>
				<h3 class="mb-4 text-lg font-semibold text-white">Valorização por Marca</h3>
				<div style="height: 200px">
					<Chart type="bar" :data="brandChartData" :options="brandChartOptions" :height="200" />
				</div>
			</div>
		</div>

		<div
			v-if="stats.insights && stats.insights.length > 0"
			class="grid grid-cols-1 gap-4 md:grid-cols-2"
		>
			<div
				v-for="insight in stats.insights"
				:key="insight.title"
				class="rounded-xl p-6"
				:class="insightCardClass(insight.type)"
			>
				<div class="mb-1 text-sm font-medium opacity-80">{{ insight.title }}</div>
				<div class="mb-2 text-2xl font-bold">{{ insight.value }}</div>
				<p v-if="insight.description" class="text-sm opacity-70">{{ insight.description }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { GarageStats } from '@/schemas/garage'

const props = defineProps<{
	stats: GarageStats
}>()

const valueChartData = computed(() => {
	return {
		labels: props.stats.valueHistory.map(h => h.month),
		datasets: [
			{
				label: 'Valor da Garagem (R$)',
				data: props.stats.valueHistory.map(h => h.value),
				borderColor: '#3b82f6',
				backgroundColor: 'rgba(59, 130, 246, 0.1)',
				tension: 0.4,
				fill: true
			}
		]
	}
})

const valueChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		}
	}
}

const segmentChartData = computed(() => {
	return {
		labels: props.stats.segmentBreakdown.map(s => s.type),
		datasets: [
			{
				data: props.stats.segmentBreakdown.map(s => s.count),
				backgroundColor: ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6'],
				borderWidth: 0
			}
		]
	}
})

const segmentChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom' as const,
			labels: {
				color: '#e4e4e7',
				padding: 15,
				font: {
					size: 12
				}
			}
		}
	}
}

const brandChartData = computed(() => {
	return {
		labels: props.stats.brandVariation.map(b => b.brand),
		datasets: [
			{
				label: 'Valorização (%)',
				data: props.stats.brandVariation.map(b => b.avgVariation),
				backgroundColor: props.stats.brandVariation.map(b =>
					b.avgVariation > 0 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)'
				),
				borderRadius: 6
			}
		]
	}
})

const brandChartOptions = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: false
		}
	}
}

function insightCardClass(type: 'positive' | 'negative' | 'neutral'): string {
	const classes = {
		positive: 'bg-emerald-900/30 text-emerald-400 border border-emerald-800/50',
		negative: 'bg-red-900/30 text-red-400 border border-red-800/50',
		neutral: 'bg-zinc-800/50 text-zinc-300 border border-zinc-700/50'
	}
	return classes[type]
}
</script>
