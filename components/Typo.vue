<template>
  <UiText
    :as="as || 'p'"
    :variant="uiVariant"
    :size="uiSize"
    :weight="uiWeight"
    :class="color"
  >
    <slot />
  </UiText>
</template>

<script setup lang="ts">
interface Props {
  as?: keyof HTMLElementTagNameMap
  variant?: 'default' | 'primary' | 'secondary' | 'dark'
  color?: string
}

const props = defineProps<Props>()

// Map old variants to new UiText variants
const uiVariant = computed(() => {
  const variantMap = {
    'default': 'default',
    'primary': 'primary', 
    'secondary': 'secondary',
    'dark': 'default'
  }
  return variantMap[props.variant || 'default']
})

// Map element types to appropriate sizes
const uiSize = computed(() => {
  const sizeMap = {
    'h1': '4xl',
    'h2': '3xl',
    'h3': '2xl',
    'h4': 'xl',
    'h5': 'lg',
    'p': 'base',
    'small': 'sm',
    'span': 'xs'
  }
  return sizeMap[props.as as keyof typeof sizeMap] || 'base'
})

// Map element types to appropriate weights
const uiWeight = computed(() => {
  const weightMap = {
    'h1': 'bold',
    'h2': 'semibold',
    'h3': 'medium',
    'h4': 'medium',
    'h5': 'normal',
    'p': 'normal',
    'small': 'normal',
    'span': 'normal'
  }
  return weightMap[props.as as keyof typeof weightMap] || 'normal'
})
</script>
