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

const getOrCreateTooltip = (chart: any) => {
	let tooltipEl = chart.canvas.parentNode.querySelector('div')

	if (!tooltipEl) {
		tooltipEl = document.createElement('div')
		tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)'
		tooltipEl.style.borderRadius = '3px'
		tooltipEl.style.color = 'white'
		tooltipEl.style.opacity = 1
		tooltipEl.style.pointerEvents = 'none'
		tooltipEl.style.position = 'absolute'
		tooltipEl.style.transform = 'translate(-50%, 0)'
		tooltipEl.style.transition = 'all .1s ease'

		const table = document.createElement('table')
		table.style.margin = '0px'

		tooltipEl.appendChild(table)
		chart.canvas.parentNode.appendChild(tooltipEl)
	}

	return tooltipEl
}

const externalTooltipHandler = (context: any) => {
	const { chart, tooltip } = context
	const tooltipEl = getOrCreateTooltip(chart)

	if (tooltip.opacity === 0) {
		tooltipEl.style.opacity = 0
		return
	}

	if (tooltip.body) {
		const titleLines = tooltip.title || []
		const bodyLines = tooltip.body.map(b => b.lines)

		const tableHead = document.createElement('thead')

		titleLines.forEach(title => {
			const tr = document.createElement('tr')
			tr.style.borderWidth = 0

			const th = document.createElement('th')
			th.style.borderWidth = 0
			const text = document.createTextNode(title)

			th.appendChild(text)
			tr.appendChild(th)
			tableHead.appendChild(tr)
		})

		const tableBody = document.createElement('tbody')
		bodyLines.forEach((body, i) => {
			const colors = tooltip.labelColors[i]

			const span = document.createElement('span')
			span.style.background = colors.backgroundColor
			span.style.borderColor = colors.borderColor
			span.style.borderWidth = '2px'
			span.style.marginRight = '10px'
			span.style.height = '10px'
			span.style.width = '10px'
			span.style.display = 'inline-block'

			const tr = document.createElement('tr')
			tr.style.backgroundColor = 'inherit'
			tr.style.borderWidth = 0

			const td = document.createElement('td')
			td.style.borderWidth = 0

			const text = document.createTextNode(body)

			td.appendChild(span)
			td.appendChild(text)
			tr.appendChild(td)
			tableBody.appendChild(tr)
		})

		const tableRoot = tooltipEl.querySelector('table')

		while (tableRoot.firstChild) {
			tableRoot.firstChild.remove()
		}

		tableRoot.appendChild(tableHead)
		tableRoot.appendChild(tableBody)
	}

	const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

	tooltipEl.style.opacity = 1
	tooltipEl.style.left = positionX + tooltip.caretX + 'px'
	tooltipEl.style.top = positionY + tooltip.caretY + 'px'
	tooltipEl.style.font = tooltip.options.bodyFont.string
	tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px'
}

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
	maintainAspectRatio: false,
	interaction: {
		mode: 'index',
		intersect: false
	},
	plugins: {
		tooltip: {
			enabled: false,
			position: 'nearest',
			external: externalTooltipHandler
		}
	}
}

if (props.type === 'pie') {
	ChartJS.register(ArcElement, Legend, Tooltip)
} else if (props.type === 'bar-horizontal' || props.type === 'bar') {
	ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
} else if (props.type === 'line') {
	ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)
}

const mergedOptions = computed<ChartJS['options']>(() => {
	if (props.type === 'pie') return defu(props.options, pieOptions)
	if (props.type === 'bar-horizontal') return defu(props.options, barHorizontalOptions)
	if (props.type === 'bar') return defu(props.options, barOptions)
	if (props.type === 'line') return defu(props.options, lineOptions)
	return {}
})
</script>
