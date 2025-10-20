<template>
	<div :class="flexClasses">
		<slot />
	</div>
</template>

<script setup lang="ts">
interface Props {
	direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
	wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
	justify?: 'normal' | 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly' | 'stretch'
	align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
	gap?: number | 'none'

	directionSm?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
	directionMd?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
	directionLg?: 'row' | 'row-reverse' | 'col' | 'col-reverse'

	gapSm?: number
	gapMd?: number
	gapLg?: number
}

const props = withDefaults(defineProps<Props>(), {
	direction: 'row',
	wrap: 'nowrap',
	justify: 'normal',
	align: 'stretch'
})

const flexClasses = computed(() => {
	const base = ['flex']

	const directions = {
		row: 'flex-row',
		'row-reverse': 'flex-row-reverse',
		col: 'flex-col',
		'col-reverse': 'flex-col-reverse'
	}
	base.push(directions[props.direction])

	if (props.directionSm) base.push(`sm:${directions[props.directionSm]}`)
	if (props.directionMd) base.push(`md:${directions[props.directionMd]}`)
	if (props.directionLg) base.push(`lg:${directions[props.directionLg]}`)

	const wraps = {
		nowrap: 'flex-nowrap',
		wrap: 'flex-wrap',
		'wrap-reverse': 'flex-wrap-reverse'
	}
	base.push(wraps[props.wrap])

	const justifies = {
		normal: 'justify-normal',
		start: 'justify-start',
		end: 'justify-end',
		center: 'justify-center',
		between: 'justify-between',
		around: 'justify-around',
		evenly: 'justify-evenly',
		stretch: 'justify-stretch'
	}
	base.push(justifies[props.justify])

	const aligns = {
		start: 'items-start',
		end: 'items-end',
		center: 'items-center',
		baseline: 'items-baseline',
		stretch: 'items-stretch'
	}
	base.push(aligns[props.align])

	if (props.gap === 'none') {
		base.push('gap-0')
	} else if (typeof props.gap === 'number') {
		base.push(`gap-${props.gap}`)
	}

	if (props.gapSm) base.push(`sm:gap-${props.gapSm}`)
	if (props.gapMd) base.push(`md:gap-${props.gapMd}`)
	if (props.gapLg) base.push(`lg:gap-${props.gapLg}`)

	return base.join(' ')
})
</script>
