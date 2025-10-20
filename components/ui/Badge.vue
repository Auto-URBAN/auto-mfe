<template>
	<span :class="badgeClasses">
		<Icon
			v-if="icon"
			:name="icon"
			class="w-3 h-3"
			:class="iconPosition === 'left' ? 'mr-1' : 'ml-1'"
		/>
		<slot />
	</span>
</template>

<script setup lang="ts">
interface Props {
	variant?: 'solid' | 'soft' | 'outline' | 'dot'
	color?: 'gray' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'pink'
	size?: 'xs' | 'sm' | 'md' | 'lg'
	icon?: string
	iconPosition?: 'left' | 'right'
	rounded?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	variant: 'soft',
	color: 'gray',
	size: 'sm',
	iconPosition: 'left',
	rounded: false
})

const badgeClasses = computed(() => {
	const base = [
		'inline-flex items-center font-medium transition-colors',
		props.rounded ? 'rounded-full' : 'rounded-md'
	]

	const sizes = {
		xs: 'px-2 py-0.5 text-xs',
		sm: 'px-2.5 py-0.5 text-xs',
		md: 'px-3 py-1 text-sm',
		lg: 'px-3.5 py-1.5 text-sm'
	}

	const colorVariants = {
		gray: {
			solid: 'bg-gray-600 text-white',
			soft: 'bg-gray-100 text-gray-800',
			outline: 'border border-gray-300 text-gray-700 bg-transparent',
			dot: 'bg-gray-100 text-gray-800 relative pl-4'
		},
		blue: {
			solid: 'bg-blue-600 text-white',
			soft: 'bg-blue-100 text-blue-800',
			outline: 'border border-blue-300 text-blue-700 bg-transparent',
			dot: 'bg-blue-100 text-blue-800 relative pl-4'
		},
		green: {
			solid: 'bg-green-600 text-white',
			soft: 'bg-green-100 text-green-800',
			outline: 'border border-green-300 text-green-700 bg-transparent',
			dot: 'bg-green-100 text-green-800 relative pl-4'
		},
		yellow: {
			solid: 'bg-yellow-600 text-white',
			soft: 'bg-yellow-100 text-yellow-800',
			outline: 'border border-yellow-300 text-yellow-700 bg-transparent',
			dot: 'bg-yellow-100 text-yellow-800 relative pl-4'
		},
		red: {
			solid: 'bg-red-600 text-white',
			soft: 'bg-red-100 text-red-800',
			outline: 'border border-red-300 text-red-700 bg-transparent',
			dot: 'bg-red-100 text-red-800 relative pl-4'
		},
		purple: {
			solid: 'bg-purple-600 text-white',
			soft: 'bg-purple-100 text-purple-800',
			outline: 'border border-purple-300 text-purple-700 bg-transparent',
			dot: 'bg-purple-100 text-purple-800 relative pl-4'
		},
		pink: {
			solid: 'bg-pink-600 text-white',
			soft: 'bg-pink-100 text-pink-800',
			outline: 'border border-pink-300 text-pink-700 bg-transparent',
			dot: 'bg-pink-100 text-pink-800 relative pl-4'
		}
	}

	return [...base, sizes[props.size], colorVariants[props.color][props.variant]].join(' ')
})
</script>

<style scoped>
.relative.pl-4::before {
	content: '';
	position: absolute;
	left: 0.375rem;
	top: 50%;
	width: 0.375rem;
	height: 0.375rem;
	border-radius: 50%;
	transform: translateY(-50%);
}

.relative.pl-4.bg-gray-100::before {
	background-color: #9ca3af;
}

.relative.pl-4.bg-blue-100::before {
	background-color: #60a5fa;
}

.relative.pl-4.bg-green-100::before {
	background-color: #34d399;
}

.relative.pl-4.bg-yellow-100::before {
	background-color: #fbbf24;
}

.relative.pl-4.bg-red-100::before {
	background-color: #f87171;
}

.relative.pl-4.bg-purple-100::before {
	background-color: #a78bfa;
}

.relative.pl-4.bg-pink-100::before {
	background-color: #f472b6;
}
</style>
