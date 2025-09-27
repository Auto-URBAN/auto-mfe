<template>
  <div :class="containerClasses">
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  center?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'lg',
  padding: 'md',
  center: true
})

// Computed classes
const containerClasses = computed(() => {
  const base = ['w-full']
  
  // Center content
  if (props.center) {
    base.push('mx-auto')
  }
  
  // Size variants
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-8xl',
    full: 'max-w-none'
  }
  
  // Padding variants
  const paddings = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12'
  }
  
  return [
    ...base,
    sizes[props.size],
    paddings[props.padding]
  ].filter(Boolean).join(' ')
})
</script>