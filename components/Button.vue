<template>
  <UiButton
    v-bind="$attrs"
    :variant="variant"
    :size="size"
    :type="type"
    :disabled="disabled"
    :loading="loading"
    :block="block"
    :icon-left="iconLeft"
    :icon-right="iconRight"
    @click="$emit('click', $event)"
  >
    <slot />
  </UiButton>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconLeft?: string
  iconRight?: string
}

interface Emits {
  click: [event: MouseEvent]
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  type: 'button'
})

defineEmits<Emits>()
</script>