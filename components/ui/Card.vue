<template>
  <div :class="cardClasses">
    <!-- Header -->
    <div v-if="$slots.header || title" class="px-4 py-3 border-b border-gray-200">
      <slot name="header">
        <h3 v-if="title" class="text-lg font-semibold text-gray-900">
          {{ title }}
        </h3>
      </slot>
    </div>

    <!-- Content -->
    <div :class="contentClasses">
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="px-4 py-3 border-t border-gray-200 bg-gray-50">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string
  variant?: 'default' | 'outlined' | 'elevated' | 'flat'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  clickable?: boolean
}

interface Emits {
  click: [event: MouseEvent]
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  padding: 'md',
  rounded: 'lg',
  clickable: false
})

defineEmits<Emits>()

// Computed classes
const cardClasses = computed(() => {
  const base = ['bg-white overflow-hidden transition-all duration-200']

  // Variant styles
  const variants = {
    default: 'border border-gray-200',
    outlined: 'border-2 border-gray-200',
    elevated: 'shadow-lg border border-gray-200',
    flat: 'border-0'
  }

  // Rounded variants
  const rounded = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl'
  }

  // Interactive states
  const interactive = props.clickable
    ? ['cursor-pointer hover:shadow-md hover:shadow-gray-200']
    : []

  return [
    ...base,
    variants[props.variant],
    rounded[props.rounded],
    ...interactive
  ].join(' ')
})

const contentClasses = computed(() => {
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  }

  return paddings[props.padding]
})
</script>