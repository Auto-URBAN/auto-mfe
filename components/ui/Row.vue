<template>
	<div
		class="flex"
		v-if="type === 'flex'"
		:direction="flexDirection"
		:justify="flexJustify"
		:align="flexAlign"
		:wrap="flexWrap"
		v-bind="$attrs"
	>
		<slot />
	</div>

	<div class="grid" v-else v-bind="$attrs">
		<slot />
	</div>
</template>

<script setup lang="ts">
interface Props {
	type?: 'flex' | 'grid'
	justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
	align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
	wrap?: 'no-wrap' | 'wrap' | 'wrap-reverse'
	direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
}

const props = withDefaults(defineProps<Props>(), {
	type: 'flex'
})

const flexDirection = computed(() => {
	const directionMap = {
		row: 'row',
		'row-reverse': 'row-reverse',
		col: 'col',
		'col-reverse': 'col-reverse'
	}
	return props.direction ? directionMap[props.direction] : 'row'
})

const flexJustify = computed(() => {
	const justifyMap = {
		start: 'start',
		end: 'end',
		center: 'center',
		between: 'between',
		around: 'around',
		evenly: 'evenly'
	}
	return props.justify ? justifyMap[props.justify] : 'normal'
})

const flexAlign = computed(() => {
	const alignMap = {
		start: 'start',
		end: 'end',
		center: 'center',
		baseline: 'baseline',
		stretch: 'stretch'
	}
	return props.align ? alignMap[props.align] : 'stretch'
})

const flexWrap = computed(() => {
	const wrapMap = {
		'no-wrap': 'nowrap',
		wrap: 'wrap',
		'wrap-reverse': 'wrap-reverse'
	}
	return props.wrap ? wrapMap[props.wrap] : 'nowrap'
})
</script>
