<template>
  <div class="space-y-3">
    <div class="flex items-center space-x-2">
      <div :class="[
        'w-6 h-6 rounded-md flex items-center justify-center',
        iconBgClass
      ]">
        <Icon :name="icon" :class="['w-3 h-3', iconColorClass]" />
      </div>
      <label class="text-sm font-medium text-gray-800">{{ label }}</label>
      <span v-if="selectedCount > 0" :class="['text-xs font-medium', selectedColorClass]">
        ({{ selectedCount }} selecionado{{ selectedCount > 1 ? 's' : '' }})
      </span>
    </div>

    <!-- Search Input -->
    <div v-if="searchable" class="relative">
      <UiInput
        v-model="searchQuery"
        :placeholder="`Buscar ${label.toLowerCase()}...`"
        size="sm"
        icon-left="heroicons:magnifying-glass-20-solid"
        class="w-full"
      />
    </div>

    <!-- Selected Items (Chips) -->
    <div v-if="selectedItems.length > 0" class="flex flex-wrap gap-2">
      <div
        v-for="item in selectedItems"
        :key="getItemId(item)"
        :class="[
          'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
          chipClass
        ]"
      >
        <span>{{ getItemLabel(item) }}</span>
        <span v-if="showCount && getItemCount(item)" class="text-xs opacity-75">
          ({{ getItemCount(item) }})
        </span>
        <button
          @click="removeItem(getItemId(item))"
          :class="['hover:rounded-full p-0.5 transition-colors', chipHoverClass]"
        >
          <Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
        </button>
      </div>
    </div>

    <!-- Dropdown for selection -->
    <div class="relative">
      <button
        @click="toggleDropdown"
        :class="[
          'w-full flex items-center justify-between px-3 py-2 border rounded-md text-sm',
          'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2',
          dropdownButtonClass
        ]"
      >
        <span class="text-gray-500">
          {{ placeholder || `Selecionar ${label.toLowerCase()}` }}
        </span>
        <Icon 
          :name="isOpen ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'" 
          class="w-4 h-4 text-gray-400" 
        />
      </button>

      <!-- Dropdown Menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
        >
          <div v-if="filteredOptions.length === 0" class="px-3 py-2 text-sm text-gray-500">
            Nenhum item encontrado
          </div>
          <button
            v-for="option in filteredOptions"
            :key="getItemId(option)"
            @click="toggleItem(getItemId(option))"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 text-sm text-left',
              'hover:bg-gray-50 transition-colors',
              isItemSelected(getItemId(option)) ? selectedItemClass : '',
              getItemCount(option) === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
            :disabled="getItemCount(option) === 0"
          >
            <div class="flex items-center space-x-2">
              <div 
                v-if="isItemSelected(getItemId(option))"
                :class="['w-4 h-4 rounded flex items-center justify-center', selectedIndicatorClass]"
              >
                <Icon name="heroicons:check-20-solid" class="w-3 h-3 text-white" />
              </div>
              <div v-else class="w-4 h-4 border border-gray-300 rounded" />
              <span>{{ getItemLabel(option) }}</span>
            </div>
            <span v-if="showCount && getItemCount(option)" class="text-xs text-gray-500">
              {{ getItemCount(option) }}
            </span>
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
type GenericItem = Record<string, any>

interface Props {
  modelValue: (string | number)[]
  options: GenericItem[]
  label: string
  icon: string
  placeholder?: string
  searchable?: boolean
  showCount?: boolean
  maxSelection?: number
  variant?: 'purple' | 'orange' | 'red' | 'indigo'
  // Functions to extract data from generic items
  getItemId: (item: GenericItem) => string | number
  getItemLabel: (item: GenericItem) => string
  getItemCount?: (item: GenericItem) => number
}

interface Emits {
  (e: 'update:modelValue', value: (string | number)[]): void
  (e: 'change', selectedItems: GenericItem[]): void
}

const props = withDefaults(defineProps<Props>(), {
  searchable: true,
  showCount: true,
  maxSelection: 20,
  variant: 'purple',
  getItemCount: () => 0
})

const emit = defineEmits<Emits>()

// Component state
const isOpen = ref(false)
const searchQuery = ref('')

// Computed properties for theming
const variantClasses = computed(() => {
  const variants = {
    purple: {
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      selectedColor: 'text-purple-600',
      chip: 'bg-purple-100 text-purple-800',
      chipHover: 'hover:bg-purple-200',
      dropdownButton: 'border-gray-300 focus:ring-purple-500',
      selectedItem: 'bg-purple-50 text-purple-700',
      selectedIndicator: 'bg-purple-600'
    },
    orange: {
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      selectedColor: 'text-orange-600',
      chip: 'bg-orange-100 text-orange-800',
      chipHover: 'hover:bg-orange-200',
      dropdownButton: 'border-gray-300 focus:ring-orange-500',
      selectedItem: 'bg-orange-50 text-orange-700',
      selectedIndicator: 'bg-orange-600'
    },
    red: {
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      selectedColor: 'text-red-600',
      chip: 'bg-red-100 text-red-800',
      chipHover: 'hover:bg-red-200',
      dropdownButton: 'border-gray-300 focus:ring-red-500',
      selectedItem: 'bg-red-50 text-red-700',
      selectedIndicator: 'bg-red-600'
    },
    indigo: {
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      selectedColor: 'text-indigo-600',
      chip: 'bg-indigo-100 text-indigo-800',
      chipHover: 'hover:bg-indigo-200',
      dropdownButton: 'border-gray-300 focus:ring-indigo-500',
      selectedItem: 'bg-indigo-50 text-indigo-700',
      selectedIndicator: 'bg-indigo-600'
    }
  }
  return variants[props.variant]
})

const iconBgClass = computed(() => variantClasses.value.iconBg)
const iconColorClass = computed(() => variantClasses.value.iconColor)
const selectedColorClass = computed(() => variantClasses.value.selectedColor)
const chipClass = computed(() => variantClasses.value.chip)
const chipHoverClass = computed(() => variantClasses.value.chipHover)
const dropdownButtonClass = computed(() => variantClasses.value.dropdownButton)
const selectedItemClass = computed(() => variantClasses.value.selectedItem)
const selectedIndicatorClass = computed(() => variantClasses.value.selectedIndicator)

// Data computed properties
const selectedItems = computed(() => 
  props.options.filter(item => props.modelValue.includes(props.getItemId(item)))
)

const selectedCount = computed(() => props.modelValue.length)

const filteredOptions = computed(() => {
  let options = props.options
  
  if (searchQuery.value && props.searchable) {
    const query = searchQuery.value.toLowerCase()
    options = options.filter(option => 
      props.getItemLabel(option).toLowerCase().includes(query)
    )
  }
  
  return options.sort((a, b) => {
    // Selected items first
    const aSelected = isItemSelected(props.getItemId(a))
    const bSelected = isItemSelected(props.getItemId(b))
    if (aSelected && !bSelected) return -1
    if (!aSelected && bSelected) return 1
    
    // Then by count (desc) if available
    if (props.getItemCount) {
      const aCount = props.getItemCount(a) || 0
      const bCount = props.getItemCount(b) || 0
      if (aCount !== bCount) return bCount - aCount
    }
    
    // Then alphabetically
    return props.getItemLabel(a).localeCompare(props.getItemLabel(b))
  })
})

// Methods
const isItemSelected = (itemId: string | number): boolean => {
  return props.modelValue.includes(itemId)
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

const toggleItem = (itemId: string | number) => {
  const item = props.options.find(opt => props.getItemId(opt) === itemId)
  if (!item || (props.getItemCount && props.getItemCount(item) === 0)) return

  let newSelection = [...props.modelValue]
  
  if (isItemSelected(itemId)) {
    // Remove item
    newSelection = newSelection.filter(id => id !== itemId)
  } else {
    // Add item (check max selection)
    if (props.maxSelection && newSelection.length >= props.maxSelection) {
      return
    }
    newSelection.push(itemId)
  }
  
  emit('update:modelValue', newSelection)
  emit('change', props.options.filter(opt => newSelection.includes(props.getItemId(opt))))
  
  // Keep dropdown open for multiple selection
}

const removeItem = (itemId: string | number) => {
  const newSelection = props.modelValue.filter(id => id !== itemId)
  emit('update:modelValue', newSelection)
  emit('change', props.options.filter(opt => newSelection.includes(props.getItemId(opt))))
}

// Close dropdown when clicking outside
onClickOutside(templateRef, () => {
  isOpen.value = false
})

const templateRef = ref()
</script>