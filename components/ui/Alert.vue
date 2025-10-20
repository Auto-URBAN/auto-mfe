<template>
	<div :class="alertClasses">
		<!-- Icon -->
		<div v-if="showIcon" class="flex-shrink-0">
			<Icon :name="iconName" :class="iconClasses" />
		</div>

		<!-- Content -->
		<div class="flex-1">
			<h3 v-if="title" :class="titleClasses">
				{{ title }}
			</h3>
			<div :class="descriptionClasses">
				<slot>
					{{ description }}
				</slot>
			</div>
		</div>

		<!-- Close Button -->
		<div v-if="closable" class="flex-shrink-0 ml-4">
			<button type="button" :class="closeButtonClasses" @click="$emit('close')">
				<Icon name="heroicons:x-mark-20-solid" class="h-4 w-4" />
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
interface Props {
	variant?: 'info' | 'success' | 'warning' | 'error'
	title?: string
	description?: string
	icon?: string
	showIcon?: boolean
	closable?: boolean
}

interface Emits {
	close: []
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'info',
	showIcon: true,
	closable: false
})

defineEmits<Emits>()

// Computed properties
const alertClasses = computed(() => {
	const base = 'flex p-4 rounded-lg'

	const variants = {
		info: 'bg-blue-50 border border-blue-200',
		success: 'bg-green-50 border border-green-200',
		warning: 'bg-yellow-50 border border-yellow-200',
		error: 'bg-red-50 border border-red-200'
	}

	return `${base} ${variants[props.variant]}`
})

const iconName = computed(() => {
	if (props.icon) return props.icon

	const defaultIcons = {
		info: 'heroicons:information-circle-20-solid',
		success: 'heroicons:check-circle-20-solid',
		warning: 'heroicons:exclamation-triangle-20-solid',
		error: 'heroicons:x-circle-20-solid'
	}

	return defaultIcons[props.variant]
})

const iconClasses = computed(() => {
	const variants = {
		info: 'text-blue-400 h-5 w-5',
		success: 'text-green-400 h-5 w-5',
		warning: 'text-yellow-400 h-5 w-5',
		error: 'text-red-400 h-5 w-5'
	}

	return variants[props.variant]
})

const titleClasses = computed(() => {
	const variants = {
		info: 'text-blue-800 text-sm font-medium mb-1',
		success: 'text-green-800 text-sm font-medium mb-1',
		warning: 'text-yellow-800 text-sm font-medium mb-1',
		error: 'text-red-800 text-sm font-medium mb-1'
	}

	return variants[props.variant]
})

const descriptionClasses = computed(() => {
	const variants = {
		info: 'text-blue-700 text-sm',
		success: 'text-green-700 text-sm',
		warning: 'text-yellow-700 text-sm',
		error: 'text-red-700 text-sm'
	}

	return variants[props.variant]
})

const closeButtonClasses = computed(() => {
	const variants = {
		info: 'text-blue-400 hover:text-blue-600 focus:ring-blue-500',
		success: 'text-green-400 hover:text-green-600 focus:ring-green-500',
		warning: 'text-yellow-400 hover:text-yellow-600 focus:ring-yellow-500',
		error: 'text-red-400 hover:text-red-600 focus:ring-red-500'
	}

	return `p-1 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${variants[props.variant]}`
})
</script>
