<template>
	<div class="vehicle-gallery">
		<div class="relative">
			<div class="h-64 sm:h-80 lg:h-96 w-full">
				<img
					:src="currentImage"
					:alt="`${vehicle.title} - Imagem ${currentIndex + 1}`"
					class="w-full h-full object-cover rounded-lg"
					@load="imageLoaded = true"
				/>

				<div
					v-if="!imageLoaded"
					class="absolute inset-0 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center"
				>
					<Icon name="heroicons:photo" class="w-12 h-12 text-gray-400" />
				</div>
			</div>

			<button
				v-if="images.length > 1"
				@click="previousImage"
				class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
				:disabled="currentIndex === 0"
			>
				<Icon name="heroicons:chevron-left" class="w-5 h-5 block" />
			</button>

			<button
				v-if="images.length > 1"
				@click="nextImage"
				class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
				:disabled="currentIndex === images.length - 1"
			>
				<Icon name="heroicons:chevron-right" class="w-5 h-5 block" />
			</button>

			<div class="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
				{{ currentIndex + 1 }} / {{ images.length }}
			</div>

			<button
				@click="openLightbox"
				class="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors flex items-center justify-center"
			>
				<Icon name="heroicons:magnifying-glass-plus" class="w-5 h-5 block" />
			</button>
		</div>

		<div v-if="images.length > 1" class="mt-4">
			<div class="flex gap-2 overflow-x-auto pb-2">
				<button
					v-for="(image, index) in images"
					:key="index"
					@click="setCurrentImage(index)"
					:class="[
						'flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors',
						currentIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
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

		<div
			v-if="showLightbox"
			class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
		>
			<div class="relative max-w-6xl w-full">
				<img
					:src="currentImage"
					:alt="`${vehicle.title} - Imagem ${currentIndex + 1}`"
					class="w-full max-h-[80vh] object-contain rounded-lg"
				/>

				<button
					@click="closeLightbox"
					class="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 flex items-center justify-center"
				>
					<Icon name="heroicons:x-mark" class="w-6 h-6 block" />
				</button>

				<button
					v-if="images.length > 1 && currentIndex > 0"
					@click="previousImage"
					class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 flex items-center justify-center"
				>
					<Icon name="heroicons:chevron-left" class="w-6 h-6 block" />
				</button>

				<button
					v-if="images.length > 1 && currentIndex < images.length - 1"
					@click="nextImage"
					class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 flex items-center justify-center"
				>
					<Icon name="heroicons:chevron-right" class="w-6 h-6 block" />
				</button>

				<div
					class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm"
				>
					{{ currentIndex + 1 }} / {{ images.length }}
				</div>
			</div>
		</div>
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

const currentIndex = ref(0)
const imageLoaded = ref(false)
const showLightbox = ref(false)

const images = computed(() => {
	const vehicleImages = props.vehicle.images || []
	const coverImage = props.vehicle.coverImageUrl

	const allImages = coverImage
		? [coverImage, ...vehicleImages.filter(img => img !== coverImage)]
		: vehicleImages

	return allImages.length > 0 ? allImages : ['/imgs/car-placeholder.jpg']
})

const currentImage = computed(() => images.value[currentIndex.value])

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

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})

watch(
	() => props.vehicle,
	() => {
		currentIndex.value = 0
		imageLoaded.value = false
	},
	{ immediate: true }
)
</script>
