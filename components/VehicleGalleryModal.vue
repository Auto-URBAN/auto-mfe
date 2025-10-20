<template>
	<UiModal
		:model-value="modelValue"
		:title="`${vehicle?.title || 'Veículo'}`"
		size="full"
		:close-on-outside-click="true"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div v-if="vehicle" class="h-full flex flex-col lg:flex-row">
			<div class="flex-1 lg:w-2/3 bg-black relative">
				<div class="relative h-64 lg:h-full">
					<img
						:src="currentImage"
						:alt="vehicle.title"
						class="w-full h-full object-contain"
						@load="onImageLoad"
						@error="onImageError"
					/>

					<div
						v-if="imageLoading"
						class="absolute inset-0 bg-black/50 flex items-center justify-center"
					>
						<Icon name="heroicons:arrow-path-20-solid" class="w-8 h-8 animate-spin text-white" />
					</div>

					<button
						v-if="images.length > 1"
						class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
						@click="previousImage"
					>
						<Icon name="heroicons:chevron-left-20-solid" class="w-6 h-6" />
					</button>

					<button
						v-if="images.length > 1"
						class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
						@click="nextImage"
					>
						<Icon name="heroicons:chevron-right-20-solid" class="w-6 h-6" />
					</button>

					<div
						v-if="images.length > 1"
						class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm"
					>
						{{ currentImageIndex + 1 }} de {{ images.length }}
					</div>

					<button
						class="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
						@click="toggleZoom"
					>
						<Icon
							:name="
								isZoomed
									? 'heroicons:magnifying-glass-minus-20-solid'
									: 'heroicons:magnifying-glass-plus-20-solid'
							"
							class="w-5 h-5"
						/>
					</button>
				</div>

				<div v-if="images.length > 1" class="absolute bottom-0 left-0 right-0 bg-black/70 p-4">
					<div class="flex gap-2 justify-center overflow-x-auto max-w-full">
						<button
							v-for="(image, index) in images"
							:key="index"
							class="flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all"
							:class="
								currentImageIndex === index
									? 'border-blue-500'
									: 'border-white/30 hover:border-white/60'
							"
							@click="setCurrentImage(index)"
						>
							<img
								:src="image"
								:alt="`${vehicle.title} - foto ${index + 1}`"
								class="w-full h-full object-cover"
							/>
						</button>
					</div>
				</div>
			</div>

			<div class="lg:w-1/3 bg-white p-6 flex flex-col">
				<div class="mb-6">
					<h2 class="text-2xl font-bold text-gray-900 mb-2">{{ vehicle.title }}</h2>
					<div class="flex items-center gap-4 text-sm text-gray-600">
						<span class="flex items-center gap-1">
							<Icon name="heroicons:calendar-days-20-solid" class="w-4 h-4" />
							{{ vehicle.year }}
						</span>
						<span class="flex items-center gap-1">
							<Icon name="heroicons:map-pin-20-solid" class="w-4 h-4" />
							{{ vehicle.city }}/{{ vehicle.uf }}
						</span>
					</div>
				</div>

				<div class="mb-6">
					<div class="text-3xl font-bold text-green-600 mb-1">
						{{ formatCurrency(vehicle.price) }}
					</div>
					<p class="text-sm text-gray-500">Preço à vista</p>
				</div>

				<div class="grid grid-cols-2 gap-4 mb-6">
					<div class="bg-gray-50 p-3 rounded-lg">
						<div class="text-sm text-gray-600">Marca</div>
						<div class="font-semibold">{{ vehicle.brand }}</div>
					</div>
					<div class="bg-gray-50 p-3 rounded-lg">
						<div class="text-sm text-gray-600">Modelo</div>
						<div class="font-semibold">{{ vehicle.model }}</div>
					</div>
					<div class="bg-gray-50 p-3 rounded-lg">
						<div class="text-sm text-gray-600">Ano</div>
						<div class="font-semibold">{{ vehicle.year }}</div>
					</div>
					<div class="bg-gray-50 p-3 rounded-lg">
						<div class="text-sm text-gray-600">KM</div>
						<div class="font-semibold">{{ formatKm(vehicle.km) }}</div>
					</div>
				</div>

				<div class="mt-auto space-y-3">
					<UiButton class="w-full" size="lg" @click="goToDetails">
						<Icon name="heroicons:eye-20-solid" class="w-5 h-5 mr-2" />
						Ver Detalhes Completos
					</UiButton>

					<UiButton variant="outline" class="w-full" size="lg" @click="openInNewTab">
						<Icon name="heroicons:arrow-top-right-on-square-20-solid" class="w-5 h-5 mr-2" />
						Abrir em Nova Aba
					</UiButton>

					<div class="flex gap-2">
						<UiButton variant="outline" class="flex-1" @click="shareVehicle">
							<Icon name="heroicons:share-20-solid" class="w-4 h-4 mr-1" />
							Compartilhar
						</UiButton>

						<UiButton
							variant="outline"
							class="flex-1"
							:class="isFavorite ? 'text-red-600 border-red-300' : ''"
							@click="toggleFavorite"
						>
							<Icon
								:name="isFavorite ? 'heroicons:heart-solid' : 'heroicons:heart-20-solid'"
								class="w-4 h-4 mr-1"
							/>
							{{ isFavorite ? 'Favoritado' : 'Favoritar' }}
						</UiButton>
					</div>
				</div>

				<div class="mt-6 p-4 bg-blue-50 rounded-lg">
					<h3 class="font-semibold text-blue-900 mb-2">Interessado?</h3>
					<p class="text-sm text-blue-700 mb-3">Entre em contato para mais informações</p>
					<div class="flex gap-2">
						<UiButton size="sm" class="flex-1">
							<Icon name="heroicons:phone-20-solid" class="w-4 h-4 mr-1" />
							Ligar
						</UiButton>
						<UiButton size="sm" variant="outline" class="flex-1">
							<Icon name="heroicons:chat-bubble-left-right-20-solid" class="w-4 h-4 mr-1" />
							WhatsApp
						</UiButton>
					</div>
				</div>
			</div>
		</div>
	</UiModal>
</template>

<script setup lang="ts">
interface Props {
	modelValue: boolean
	vehicle?: any
}

interface Emits {
	(e: 'update:modelValue', value: boolean): void
	(e: 'close'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentImageIndex = ref(0)
const imageLoading = ref(false)
const isZoomed = ref(false)
const isFavorite = ref(false)

const images = computed(() => {
	if (!props.vehicle) return []

	const baseImage = props.vehicle.coverImageUrl || '/imgs/search-example.jpg'
	return [
		baseImage,
		'https:
		'https:
		'https:
		'https:
	]
})

const currentImage = computed(() => {
	return images.value[currentImageIndex.value] || '/imgs/search-example.jpg'
})

const nextImage = () => {
	if (currentImageIndex.value < images.value.length - 1) {
		currentImageIndex.value++
	} else {
		currentImageIndex.value = 0
	}
	preloadNextImage()
}

const previousImage = () => {
	if (currentImageIndex.value > 0) {
		currentImageIndex.value--
	} else {
		currentImageIndex.value = images.value.length - 1
	}
	preloadNextImage()
}

const setCurrentImage = (index: number) => {
	currentImageIndex.value = index
	preloadNextImage()
}

const preloadNextImage = () => {
	const nextIndex = (currentImageIndex.value + 1) % images.value.length
	if (images.value[nextIndex]) {
		const img = new Image()
		img.src = images.value[nextIndex]
	}
}

const toggleZoom = () => {
	isZoomed.value = !isZoomed.value
}

const onImageLoad = () => {
	imageLoading.value = false
}

const onImageError = () => {
	imageLoading.value = false
	console.error('Failed to load image:', currentImage.value)
}

const goToDetails = () => {
	if (props.vehicle) {
		navigateTo(`/carros/${props.vehicle.id}`)
		emit('close')
	}
}

const openInNewTab = () => {
	if (props.vehicle) {
		window.open(`/carros/${props.vehicle.id}`, '_blank')
	}
}

const shareVehicle = async () => {
	if (!props.vehicle) return

	const shareData = {
		title: props.vehicle.title,
		text: `Confira este ${props.vehicle.title} por ${formatCurrency(props.vehicle.price)}`,
		url: `${window.location.origin}/carros/${props.vehicle.id}`
	}

	if (navigator.share) {
		try {
			await navigator.share(shareData)
		} catch (err) {
			console.log('Share cancelled')
		}
	} else {

		try {
			await navigator.clipboard.writeText(shareData.url)

			console.log('Link copied to clipboard')
		} catch (err) {
			console.error('Failed to copy link')
		}
	}
}

const toggleFavorite = () => {
	isFavorite.value = !isFavorite.value

}

const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		maximumFractionDigits: 0
	}).format(value)
}

const formatKm = (km: number): string => {
	if (km === 0) return '0 km'
	if (km < 1000) return `${km} km`
	return `${(km / 1000).toFixed(0)}k km`
}

const handleKeydown = (event: KeyboardEvent) => {
	if (!props.modelValue) return

	switch (event.key) {
		case 'ArrowLeft':
			event.preventDefault()
			previousImage()
			break
		case 'ArrowRight':
			event.preventDefault()
			nextImage()
			break
		case 'Escape':
			event.preventDefault()
			emit('close')
			break
	}
}

watch(
	() => props.modelValue,
	newValue => {
		if (newValue) {
			currentImageIndex.value = 0
			imageLoading.value = true
			isZoomed.value = false
			preloadNextImage()
		}
	}
)

watch(
	() => currentImageIndex.value,
	() => {
		imageLoading.value = true
	}
)

onMounted(() => {
	document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
	document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
::-webkit-scrollbar {
	height: 6px;
}

::-webkit-scrollbar-track {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 3px;
}

::-webkit-scrollbar-thumb {
	background: rgba(255, 255, 255, 0.3);
	border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
	background: rgba(255, 255, 255, 0.5);
}
</style>
