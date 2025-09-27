<template>
  <div class="relative">
    <div class="relative">
      <UInput
        v-model="searchQuery"
        :placeholder="placeholder"
        size="lg"
        class="w-full pr-10"
        @keyup.enter="handleSearch"
      >
        <template #leading>
          <UIcon name="i-heroicons-magnifying-glass" class="text-gray-400" />
        </template>
      </UInput>
      
      <!-- Clear button -->
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
      >
        <UIcon name="i-heroicons-x-mark" class="w-4 h-4" />
      </button>
    </div>

    <!-- Search suggestions (optional future feature) -->
    <div 
      v-if="showSuggestions && suggestions.length > 0"
      class="absolute top-full left-0 right-0 bg-white border rounded-lg shadow-lg mt-1 z-10"
    >
      <div 
        v-for="suggestion in suggestions" 
        :key="suggestion"
        @click="selectSuggestion(suggestion)"
        class="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  placeholder?: string
  suggestions?: string[]
  showSuggestions?: boolean
}

interface Emits {
  search: [query: string]
  clear: []
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Busque por marca, modelo...',
  suggestions: () => [],
  showSuggestions: false
})

const emit = defineEmits<Emits>()

const searchQuery = ref('')

function handleSearch() {
  emit('search', searchQuery.value.trim())
}

function clearSearch() {
  searchQuery.value = ''
  emit('clear')
}

function selectSuggestion(suggestion: string) {
  searchQuery.value = suggestion
  handleSearch()
}

// Watch for external search query changes
watch(searchQuery, (newQuery) => {
  if (!newQuery.trim()) {
    emit('clear')
  }
})
</script>