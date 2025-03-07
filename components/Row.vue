<template>
    <div :class="classes">
        <slot />
    </div>
</template>
<script setup lang="ts">
const props = defineProps<{
    type?: 'flex' | 'grid',
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly',
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch',
    wrap?: 'no-wrap' | 'wrap' | 'wrap-reverse',
    direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
}>()

const classes = computed(() => {
    return [
        props.type === 'grid' ? 'grid' : 'flex',
        props.justify ? `justify-${props.justify}` : '',
        props.align ? `items-${props.align}` : '',
        props.wrap ? `flex-${props.wrap}` : '',
        props.direction ? `flex-${props.direction}` : ''
    ]
})
</script>