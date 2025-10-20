<template>
	<UiCard
		:clickable="clickable"
		:class="[
			'transition-all duration-200',
			clickable ? 'hover:shadow-lg cursor-pointer hover:scale-[1.02]' : ''
		]"
		@click="handleClick"
	>
		<div class="flex items-center">
			<div
				:class="[
					'flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center',
					colorClasses
				]"
			>
				<Icon :name="icon" class="w-6 h-6 text-white" />
			</div>

			<div class="ml-4 flex-1 min-w-0">
				<p class="text-sm font-medium text-gray-500 truncate">
					{{ title }}
				</p>
				<p class="text-2xl font-bold text-gray-900">
					{{ formattedValue }}
				</p>
			</div>

			<Icon
				v-if="clickable"
				name="heroicons:chevron-right-20-solid"
				class="w-5 h-5 text-gray-400 ml-2"
			/>
		</div>
	</UiCard>
</template>

<script setup lang="ts">
interface Props {
	title: string
	value: number
	icon: string
	color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
	clickable?: boolean
	formatAsNumber?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	color: 'blue',
	clickable: false,
	formatAsNumber: true
})

const emit = defineEmits<{
	click: []
}>()

const formattedValue = computed(() => {
	if (!props.formatAsNumber) return props.value.toString()

	if (props.value >= 1000) {
		return (props.value / 1000).toFixed(1) + 'k'
	}

	return props.value.toLocaleString('pt-BR')
})

const colorClasses = computed(() => {
	const colors = {
		blue: 'bg-primary-500',
		green: 'bg-success-500',
		yellow: 'bg-warning-500',
		red: 'bg-danger-500',
		purple: 'bg-purple-500',
		gray: 'bg-gray-500'
	}

	return colors[props.color] || colors.blue
})

const handleClick = () => {
	if (props.clickable) {
		emit('click')
	}
}
</script>
