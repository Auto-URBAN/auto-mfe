<template>
	<Pie v-if="props.type === 'pie'" :data="props.data" :options="mergedOptions" />
	<Bar v-else-if="props.type === 'bar-horizontal'" :data="props.data" :options="mergedOptions" />
	<Bar v-else-if="props.type === 'bar'" :data="props.data" :options="mergedOptions" />
	<Line v-else-if="props.type === 'line'" :data="props.data" :options="mergedOptions" />
</template>

<script lang="ts" setup>
import {
	ArcElement,
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip
} from 'chart.js'
import { Bar, Line, Pie } from 'vue-chartjs'
import { defu } from 'defu'

const props = defineProps({
	data: {
		type: Object as PropType<ChartJS['data']>,
		required: true
	},
	legend: {
		type: Boolean,
		default: false
	},
	type: {
		type: String as PropType<'pie' | 'bar' | 'bar-horizontal' | 'line'>,
		required: true
	},
	options: {
		type: Object as PropType<ChartJS['options']>,
		default: () => ({})
	},
	height: {
		type: Number,
		default: undefined
	},
	width: {
		type: Number,
		default: undefined
	}
})

const pieOptions: ChartJS['options'] = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			display: props.legend ? props.legend : false,
			position: 'bottom',
			labels: {
				boxHeight: 10,
				usePointStyle: true,
				borderRadius: 40,
				font: {
					size: 12
				}
			}
		}
	}
}

const barHorizontalOptions: ChartJS['options'] = {
	indexAxis: 'y',
	elements: {},
	scales: {
		x: {
			grid: {
				display: false
			},
			ticks: {
				callback() {
					return ''
				}
			}
		},
		y: {
			grid: {
				display: false
			}
		}
	},
	responsive: true,
	plugins: {
		legend: {
			display: props.legend ? props.legend : false,
			position: 'bottom',
			labels: {
				boxHeight: 10,
				usePointStyle: true,
				borderRadius: 40,
				font: {
					size: 12
				}
			}
		}
	}
}

const barOptions: ChartJS['options'] = {
	elements: {
		bar: {
			borderWidth: 0,
			borderRadius: 10
		}
	},

	scales: {
		x: {
			grid: {
				display: false
			}
		}
	},
	responsive: true,
	plugins: {
		legend: {
			display: props.legend ? props.legend : false,
			position: 'bottom',
			labels: {
				boxHeight: 10,
				font: {
					size: 12
				}
			}
		}
	}
}

const lineOptions: ChartJS['options'] = {
	responsive: true,
	maintainAspectRatio: false
}

if (props.type === 'pie') {
	ChartJS.register(ArcElement, Legend, Tooltip)
} else if (props.type === 'bar-horizontal' || props.type === 'bar') {
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
} else if (props.type === 'line') {
	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement)
}

const mergedOptions = computed<ChartJS['options']>(() => {
	if (props.type === 'pie') return defu(props.options, pieOptions)
	if (props.type === 'bar-horizontal') return defu(props.options, barHorizontalOptions)
	if (props.type === 'bar') return defu(props.options, barOptions)
	if (props.type === 'line') return defu(props.options, lineOptions)
	return {}
})
</script>
