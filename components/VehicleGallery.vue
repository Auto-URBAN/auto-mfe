<template>
  <div class="vehicle-gallery">
    <!-- Main Gallery -->
    <div class="relative">
      <div class="aspect-w-16 aspect-h-9 lg:aspect-w-4 lg:aspect-h-3">
        <img
          :src="currentImage"
          :alt="`${vehicle.title} - Imagem ${currentIndex + 1}`"
          class="w-full h-full object-cover rounded-lg"
          @load="imageLoaded = true"
        />
        
        <!-- Loading overlay -->
        <div 
          v-if="!imageLoaded" 
          class="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"
        >
          <UIcon name="i-heroicons-photo" class="w-12 h-12 text-gray-400" />
        </div>
      </div>

      <!-- Navigation arrows -->
      <button
        v-if="images.length > 1"
        @click="previousImage"
        class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        :disabled="currentIndex === 0"
      >
        <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
      </button>
      
      <button
        v-if="images.length > 1"
        @click="nextImage"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
        :disabled="currentIndex === images.length - 1"
      >
        <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
      </button>

      <!-- Image counter -->
      <div class="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>

      <!-- Fullscreen button -->
      <button
        @click="openLightbox"
        class="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
      >
        <UIcon name="i-heroicons-magnifying-glass-plus" class="w-5 h-5" />
      </button>
    </div>

    <!-- Thumbnails -->
    <div v-if="images.length > 1" class="mt-4">
      <div class="flex gap-2 overflow-x-auto pb-2">
        <button
          v-for="(image, index) in images"
          :key="index"
          @click="setCurrentImage(index)"
          :class="[
            'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors',
            currentIndex === index 
              ? 'border-blue-500' 
              : 'border-gray-200 hover:border-gray-300'
          ]"
        >
          <img
            :src="image"
            :alt="`${vehicle.title} - Miniatura ${index + 1}`"
            class="w-full h-full object-cover"
          />
        </button>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <UModal v-model="showLightbox" :ui="{ width: 'max-w-6xl' }">
      <div class="relative">
        <img
          :src="currentImage"
          :alt="`${vehicle.title} - Imagem ${currentIndex + 1}`"
          class="w-full max-h-[80vh] object-contain"
        />
        
        <!-- Close button -->
        <button
          @click="closeLightbox"
          class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
        >
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>

        <!-- Lightbox navigation -->
        <button
          v-if="images.length > 1 && currentIndex > 0"
          @click="previousImage"
          class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-6 h-6" />
        </button>
        
        <button
          v-if="images.length > 1 && currentIndex < images.length - 1"
          @click="nextImage"
          class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-6 h-6" />
        </button>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
interface Props {
  vehicle: {
    title: string
    images?: string[]
    coverImageUrl?: string
  }
}

const props = defineProps<Props>()

// Reactive data
const currentIndex = ref(0)
const imageLoaded = ref(false)
const showLightbox = ref(false)

// Computed
const images = computed(() => {
  const vehicleImages = props.vehicle.images || []
  const coverImage = props.vehicle.coverImageUrl

  // Combine cover image with other images, removing duplicates
  const allImages = coverImage 
    ? [coverImage, ...vehicleImages.filter(img => img !== coverImage)]
    : vehicleImages

  // Fallback to placeholder if no images
  return allImages.length > 0 
    ? allImages 
    : ['/imgs/car-placeholder.jpg']
})

const currentImage = computed(() => images.value[currentIndex.value])

// Methods
const setCurrentImage = (index: number) => {
  if (index >= 0 && index < images.value.length) {
    currentIndex.value = index
    imageLoaded.value = false
  }
}

const nextImage = () => {
  if (currentIndex.value < images.value.length - 1) {
    setCurrentImage(currentIndex.value + 1)
  }
}

const previousImage = () => {
  if (currentIndex.value > 0) {
    setCurrentImage(currentIndex.value - 1)
  }
}

const openLightbox = () => {
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
}

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (showLightbox.value) {
    if (event.key === 'ArrowLeft') {
      previousImage()
    } else if (event.key === 'ArrowRight') {
      nextImage()
    } else if (event.key === 'Escape') {
      closeLightbox()
    }
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for vehicle changes
watch(() => props.vehicle, () => {
  currentIndex.value = 0
  imageLoaded.value = false
}, { immediate: true })
</script>