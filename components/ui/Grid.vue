<template>
	<div :class="gridClasses">
		<slot />
	</div>
</template>

<script setup lang="ts">
interface Props {
	cols?: number | 'none' | 'subgrid'
	gap?: number | 'none'
	rows?: number | 'none' | 'subgrid'
	flow?: 'row' | 'col' | 'row-dense' | 'col-dense'
	// Responsive columns
	sm?: number
	md?: number
	lg?: number
	xl?: number
	// Responsive gaps
	gapSm?: number
	gapMd?: number
	gapLg?: number
	gapXl?: number
}

const props = withDefaults(defineProps<Props>(), {
	cols: 12,
	gap: 4
})

// Computed classes
const gridClasses = computed(() => {
	const base = ['grid']

	// Grid columns
	if (props.cols === 'none') {
		base.push('grid-cols-none')
	} else if (props.cols === 'subgrid') {
		base.push('grid-cols-subgrid')
	} else if (typeof props.cols === 'number') {
		base.push(`grid-cols-${props.cols}`)
	}

	// Responsive columns
	if (props.sm) base.push(`sm:grid-cols-${props.sm}`)
	if (props.md) base.push(`md:grid-cols-${props.md}`)
	if (props.lg) base.push(`lg:grid-cols-${props.lg}`)
	if (props.xl) base.push(`xl:grid-cols-${props.xl}`)

	// Grid rows
	if (props.rows === 'none') {
		base.push('grid-rows-none')
	} else if (props.rows === 'subgrid') {
		base.push('grid-rows-subgrid')
	} else if (typeof props.rows === 'number') {
		base.push(`grid-rows-${props.rows}`)
	}

	// Grid flow
	if (props.flow) {
		const flows = {
			row: 'grid-flow-row',
			col: 'grid-flow-col',
			'row-dense': 'grid-flow-row-dense',
			'col-dense': 'grid-flow-col-dense'
		}
		base.push(flows[props.flow])
	}

	// Gap
	if (props.gap === 'none') {
		base.push('gap-0')
	} else if (typeof props.gap === 'number') {
		base.push(`gap-${props.gap}`)
	}

	// Responsive gaps
	if (props.gapSm) base.push(`sm:gap-${props.gapSm}`)
	if (props.gapMd) base.push(`md:gap-${props.gapMd}`)
	if (props.gapLg) base.push(`lg:gap-${props.gapLg}`)
	if (props.gapXl) base.push(`xl:gap-${props.gapXl}`)

	return base.join(' ')
})
</script>
