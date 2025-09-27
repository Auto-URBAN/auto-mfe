<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }}
      <span v-if="required" class="text-red-500 ml-1">*</span>
    </label>

    <!-- Input Container -->
    <div class="relative">
      <!-- Icon Left -->
      <div v-if="iconLeft" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon :name="iconLeft" class="h-4 w-4 text-gray-400" />
      </div>

      <!-- Input -->
      <input
        :id="inputId"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :class="inputClasses"
        :value="modelValue"
        @input="handleInput"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      >

      <!-- Icon Right -->
      <div v-if="iconRight" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <Icon :name="iconRight" class="h-4 w-4 text-gray-400" />
      </div>
    </div>

    <!-- Helper Text -->
    <p v-if="helperText" class="mt-1 text-sm text-gray-500">
      {{ helperText }}
    </p>

    <!-- Error Message -->
    <p v-if="error" class="mt-1 text-sm text-red-600">
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  readonly?: boolean
  required?: boolean
  error?: string
  helperText?: string
  iconLeft?: string
  iconRight?: string
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  'update:modelValue': [value: string | number]
  blur: [event: FocusEvent]
  focus: [event: FocusEvent]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  size: 'md',
  disabled: false,
  readonly: false,
  required: false
})

const emit = defineEmits<Emits>()

// Generate unique ID
const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

// Handle input
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}

// Computed classes
const inputClasses = computed(() => {
  const base = [
    'block w-full rounded-lg border transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
  ]

  // Size variants
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-3 py-2.5 text-sm',
    lg: 'px-4 py-3 text-base'
  }

  // State variants
  const states = props.error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

  // Icon padding
  const iconPadding = {
    left: props.iconLeft ? 'pl-10' : '',
    right: props.iconRight ? 'pr-10' : ''
  }

  return [
    ...base,
    sizes[props.size],
    states,
    iconPadding.left,
    iconPadding.right
  ].filter(Boolean).join(' ')
})
</script>