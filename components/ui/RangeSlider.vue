<template>
  <div class="space-y-3">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-lg flex items-center justify-center" :class="iconBgClass">
        <Icon :name="icon" class="w-3 h-3" :class="iconClass" />
      </div>
      <label class="text-sm font-medium text-gray-800">{{ label }}</label>
    </div>

    <!-- Range Slider -->
    <div class="px-2">
      <div class="relative py-4">
        <!-- Range Track -->
        <div class="h-2 bg-gray-200 rounded-full relative">
          <div 
            class="h-2 rounded-full absolute"
            :class="gradientClass"
            :style="rangeStyle"
          ></div>
        </div>
        
        <!-- Hidden Range Inputs -->
        <input
          v-model.number="currentMin"
          @input="updateRange"
          type="range"
          :min="config.min"
          :max="config.max"
          :step="config.step"
          class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-10"
          style="pointer-events: none;"
        />
        <input
          v-model.number="currentMax"
          @input="updateRange"
          type="range"
          :min="config.min"
          :max="config.max"
          :step="config.step"
          class="absolute top-0 w-full h-10 opacity-0 cursor-pointer z-20"
        />
        
        <!-- Custom Thumbs -->
        <div 
          class="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
          :class="thumbMinClass"
          :style="{ left: minThumbPosition }"
          @mousedown="startDrag('min', $event)"
        ></div>
        <div 
          class="absolute w-4 h-4 border-2 border-white rounded-full shadow-lg cursor-pointer z-30 transform -translate-x-1/2 -translate-y-1"
          :class="thumbMaxClass"
          :style="{ left: maxThumbPosition }"
          @mousedown="startDrag('max', $event)"
        ></div>
      </div>
      
      <!-- Range Labels -->
      <div class="flex justify-between mt-1 text-xs text-gray-500">
        <input type="text" v-model="currentMin" class="w-16 p-1 border border-gray-300 rounded text-xs text-gray-700" />
        <input type="text" v-model="currentMax" class="w-16 p-1 border border-gray-300 rounded text-xs text-gray-700" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue?: { min?: number; max?: number }
  config: {
    min: number
    max: number
    step: number
  }
  label: string
  icon: string
  unit: string
  variant: 'price' | 'km'
}

interface Emits {
  (e: 'update:modelValue', value: { min?: number; max?: number }): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({ min: undefined, max: undefined })
})

const emit = defineEmits<Emits>()

// Local state
const currentMin = ref(props.modelValue?.min || props.config.min)
const currentMax = ref(props.modelValue?.max || props.config.max)

// Drag state
const isDragging = ref(false)
const dragType = ref<'min' | 'max' | null>(null)

// Computed properties for styling based on variant
const iconBgClass = computed(() => {
  return props.variant === 'price' ? 'bg-red-100' : 'bg-indigo-100'
})

const iconClass = computed(() => {
  return props.variant === 'price' ? 'text-red-600' : 'text-indigo-600'
})

const textClass = computed(() => {
  return props.variant === 'price' ? 'text-red-700' : 'text-indigo-700'
})

const gradientClass = computed(() => {
  return props.variant === 'price' 
    ? 'bg-gradient-to-r from-red-400 to-red-600' 
    : 'bg-gradient-to-r from-indigo-400 to-indigo-600'
})

const thumbMinClass = computed(() => {
  return props.variant === 'price' ? 'bg-red-500' : 'bg-indigo-500'
})

const thumbMaxClass = computed(() => {
  return props.variant === 'price' ? 'bg-red-600' : 'bg-indigo-600'
})

// Computed properties for slider functionality
const rangeStyle = computed(() => {
  const min = Math.max(currentMin.value || props.config.min, props.config.min)
  const max = Math.min(currentMax.value || props.config.max, props.config.max)
  
  const leftPercent = ((min - props.config.min) / (props.config.max - props.config.min)) * 100
  const rightPercent = ((props.config.max - max) / (props.config.max - props.config.min)) * 100
  
  return {
    left: `${leftPercent}%`,
    right: `${rightPercent}%`
  }
})

const minThumbPosition = computed(() => {
  const value = currentMin.value || props.config.min
  const percent = ((value - props.config.min) / (props.config.max - props.config.min)) * 100
  return `${percent}%`
})

const maxThumbPosition = computed(() => {
  const value = currentMax.value || props.config.max
  const percent = ((value - props.config.min) / (props.config.max - props.config.min)) * 100
  return `${percent}%`
})

// Methods
const formatDisplayValue = (value: number): string => {
  if (!value && value !== 0) return '0'
  
  if (props.variant === 'price') {
    if (value >= 1000000) {
      return `R$ ${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(0)}k`
    }
    return `R$ ${value.toString()}`
  } else {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`
    }
    return value.toString()
  }
}

const updateRange = () => {
  // Ensure min is not greater than max
  if (currentMin.value && currentMax.value && currentMin.value > currentMax.value) {
    if (dragType.value === 'min') {
      currentMax.value = currentMin.value
    } else {
      currentMin.value = currentMax.value
    }
  }
  
  emit('update:modelValue', {
    min: currentMin.value || undefined,
    max: currentMax.value || undefined
  })
}

const startDrag = (type: 'min' | 'max', event: MouseEvent) => {
  event.preventDefault()
  isDragging.value = true
  dragType.value = type
  
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !dragType.value) return
    
    const rect = (event.target as HTMLElement).closest('.relative')?.getBoundingClientRect()
    if (!rect) return
    
    const percent = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
    const value = Math.round((percent / 100) * (props.config.max - props.config.min) + props.config.min)
    const steppedValue = Math.round(value / props.config.step) * props.config.step
    
    if (dragType.value === 'min') {
      currentMin.value = Math.min(steppedValue, currentMax.value || props.config.max)
    } else {
      currentMax.value = Math.max(steppedValue, currentMin.value || props.config.min)
    }
    updateRange()
  }
  
  const handleMouseUp = () => {
    isDragging.value = false
    dragType.value = null
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
  
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const reset = () => {
  currentMin.value = props.config.min
  currentMax.value = props.config.max
  updateRange()
}

// Watch for external changes
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    currentMin.value = newValue.min || props.config.min
    currentMax.value = newValue.max || props.config.max
  }
}, { deep: true, immediate: true })

// Expose reset method
defineExpose({
  reset
})
</script>