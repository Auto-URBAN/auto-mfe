<script setup lang="ts">
defineProps<{
	as?: keyof HTMLElementTagNameMap
	variant?: 'default' | 'primary' | 'secondary' | 'dark'
	color?: string
}>()
</script>

<template>
	<component
		:is="as || 'p'"
		:class="[
			'font-sans',
			{
				'text-4xl font-bold': as === 'h1',
				'text-3xl font-semibold': as === 'h2',
				'text-2xl font-medium': as === 'h3',
				'text-xl font-medium': as === 'h4',
				'text-lg font-normal': as === 'h5',
				'text-base font-normal': as === 'p',
				'text-sm font-normal': as === 'small',
				'text-xs font-normal': as === 'span',
				'text-primary': variant === 'primary',
				'text-gray-600': variant === 'secondary',
				'text-black': variant === 'dark'
			},
			'p-0 m-0',
			color
		]"
	>
		<slot />
	</component>
</template>
