<template>
	<component :is="as" :class="textClasses">
		<slot />
	</component>
</template>

<script setup lang="ts">
interface Props {
	as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'small'
	variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'danger'
	size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
	weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
	align?: 'left' | 'center' | 'right' | 'justify'
	truncate?: boolean
	uppercase?: boolean
	lowercase?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	as: 'p',
	variant: 'default',
	size: 'base',
	weight: 'normal',
	align: 'left'
})

const textClasses = computed(() => {
	const base = ['font-sans']

	const sizes = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg',
		xl: 'text-xl',
		'2xl': 'text-2xl',
		'3xl': 'text-3xl',
		'4xl': 'text-4xl'
	}

	const weights = {
		light: 'font-light',
		normal: 'font-normal',
		medium: 'font-medium',
		semibold: 'font-semibold',
		bold: 'font-bold'
	}

	const variants = {
		default: 'text-gray-900',
		primary: 'text-primary-600',
		secondary: 'text-gray-600',
		muted: 'text-gray-500',
		success: 'text-success-600',
		warning: 'text-warning-600',
		danger: 'text-danger-600'
	}

	const alignments = {
		left: 'text-left',
		center: 'text-center',
		right: 'text-right',
		justify: 'text-justify'
	}

	const modifiers = []
	if (props.truncate) modifiers.push('truncate')
	if (props.uppercase) modifiers.push('uppercase')
	if (props.lowercase) modifiers.push('lowercase')

	return [
		...base,
		sizes[props.size],
		weights[props.weight],
		variants[props.variant],
		alignments[props.align],
		...modifiers
	]
		.filter(Boolean)
		.join(' ')
})
</script>
