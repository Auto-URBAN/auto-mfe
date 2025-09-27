<template>
  <div class="w-full">
    <!-- Label with tooltip -->
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} 
      <span v-if="required" class="text-red-500 ml-1">*</span>
      <span v-if="description" class="inline-flex items-center ml-1">
        <Icon name="heroicons:information-circle" class="w-4 h-4 text-gray-400" />
      </span>
    </label>

    <!-- Tooltip for description -->
    <div v-if="description" class="mb-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
      {{ description }}
    </div>

    <!-- Input -->
    <UiInput
      :id="inputId"
      :model-value="formattedValue"
      :type="type === 'money' ? 'text' : type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :size="size"
      :icon-left="iconLeft"
      :icon-right="iconRight"
      :error="error"
      :helper-text="helperText"
      @update:model-value="handleInput"
      @blur="$emit('blur', $event)"
      @focus="$emit('focus', $event)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  description?: string
  id?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  min?: number
  max?: number
  step?: number
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: string
  iconRight?: string
  error?: string
  helperText?: string
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
  required: false
})

const emit = defineEmits<Emits>()

// Generate unique ID
const inputId = computed(() => props.id || `input-${Math.random().toString(36).substr(2, 9)}`)

// Formatted value for money type
const formattedValue = computed(() => {
  if (props.type === 'money') {
    const value = parseFloat(String(props.modelValue)) || 0
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    })
  }
  return props.modelValue
})

// Handle input
const handleInput = (value: string | number) => {
  let processedValue = value
  
  if (props.type === 'money') {
    // Remove caracteres não numéricos para money
    processedValue = String(value).replace(/[^\d.-]/g, '')
  }
  
  emit('update:modelValue', processedValue)
}
</script>
