<template>
	<div :class="skeletonClasses" />
</template>

<script setup lang="ts">
interface Props {
	width?: string
	height?: string
	variant?: 'rectangular' | 'circular' | 'text'
	animation?: 'pulse' | 'wave' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'rectangular',
	animation: 'pulse'
})

// Computed classes
const skeletonClasses = computed(() => {
	const base = ['bg-gray-200']

	// Animation variants
	const animations = {
		pulse: 'animate-pulse',
		wave: 'animate-pulse', // Could implement wave animation later
		none: ''
	}

	// Shape variants
	const variants = {
		rectangular: 'rounded-md',
		circular: 'rounded-full',
		text: 'rounded h-4'
	}

	const styles = []

	// Width and height styles
	if (props.width) {
		styles.push(`width: ${props.width}`)
	}

	if (props.height) {
		styles.push(`height: ${props.height}`)
	}

	return [...base, animations[props.animation], variants[props.variant]].filter(Boolean).join(' ')
})
</script>

<style scoped>
/* Custom wave animation if needed later */
@keyframes wave {
	0% {
		transform: translateX(-100%);
	}
	50% {
		transform: translateX(100%);
	}
	100% {
		transform: translateX(100%);
	}
}
</style>
