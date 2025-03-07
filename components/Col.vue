<template>
    <div :class="classes">
        <slot />
    </div>
</template>
<script setup lang="ts">

const props = defineProps<{
    mobile?: number
    desktop?: number
}>()

const classes = computed(() => {
    return [    
        `col-span-${props.mobile ? props.mobile : 'auto'} lg:col-span-${props.desktop ? props.desktop : 'auto'}`
    ]
})

</script>