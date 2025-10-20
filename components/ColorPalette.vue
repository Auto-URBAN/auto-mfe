<template>
	<div class="space-y-3">
		<div class="flex items-center space-x-2">
			<div class="w-6 h-6 bg-pink-100 rounded-md flex items-center justify-center">
				<Icon name="heroicons:swatch-20-solid" class="w-3 h-3 text-pink-600" />
			</div>
			<label class="text-sm font-medium text-gray-800">Cores</label>
			<span v-if="selectedCount > 0" class="text-xs text-pink-600 font-medium">
				({{ selectedCount }} selecionada{{ selectedCount > 1 ? 's' : '' }})
			</span>
		</div>

		<!-- Selected Colors (Chips) -->
		<div v-if="selectedColors.length > 0" class="flex flex-wrap gap-2">
			<div
				v-for="color in selectedColors"
				:key="color.id"
				class="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-100 text-pink-800 rounded-full text-sm font-medium"
			>
				<div
					class="w-4 h-4 rounded-full border-2 border-white shadow-sm"
					:style="{ backgroundColor: color.hex }"
				/>
				<span>{{ color.name }}</span>
				<span class="text-xs opacity-75">({{ color.count }})</span>
				<button
					@click="removeColor(color.id)"
					class="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
				>
					<Icon name="heroicons:x-mark-20-solid" class="w-3 h-3" />
				</button>
			</div>
		</div>

		<!-- Colors Palette -->
		<div class="grid grid-cols-5 sm:grid-cols-6 gap-3">
			<button
				v-for="color in sortedColors"
				:key="color.id"
				@click="toggleColor(color.id)"
				:class="[
					'group relative w-12 h-12 rounded-full border-4 transition-all duration-200',
					'hover:scale-110 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2',
					isSelected(color.id)
						? 'border-gray-800 ring-2 ring-pink-500 ring-offset-2 scale-110'
						: 'border-white hover:border-gray-300',
					color.count === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
				]"
				:style="{ backgroundColor: color.hex }"
				:disabled="color.count === 0"
				:title="`${color.name} (${color.count} veículos)`"
			>
				<!-- Selected Indicator -->
				<div v-if="isSelected(color.id)" class="absolute inset-0 flex items-center justify-center">
					<div class="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md">
						<Icon name="heroicons:check-20-solid" class="w-4 h-4 text-gray-800" />
					</div>
				</div>

				<!-- Hover Overlay -->
				<div
					class="absolute inset-0 rounded-full bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"
				/>

				<!-- Special handling for white color -->
				<div
					v-if="color.hex === '#ffffff'"
					class="absolute inset-1 rounded-full border border-gray-200"
				/>
			</button>
		</div>

		<!-- Color Details -->
		<div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
			<div
				v-for="color in visibleColors"
				:key="color.id"
				class="flex items-center gap-2 p-2 rounded-md bg-gray-50"
			>
				<div
					class="w-3 h-3 rounded-full border border-gray-300"
					:style="{ backgroundColor: color.hex }"
				/>
				<span class="font-medium text-gray-700">{{ color.name }}</span>
				<span class="text-gray-500">({{ color.count }})</span>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { Color } from '~/schemas/filters'

interface Props {
	colors: Color[]
	modelValue: string[]
	maxSelection?: number
	showDetails?: boolean
}

interface Emits {
	(e: 'update:modelValue', value: string[]): void
	(e: 'change', selectedColors: Color[]): void
}

const props = withDefaults(defineProps<Props>(), {
	maxSelection: 5,
	showDetails: true
})

const emit = defineEmits<Emits>()

// Computed properties
const selectedColors = computed(() =>
	props.colors.filter(color => props.modelValue.includes(color.id))
)

const selectedCount = computed(() => props.modelValue.length)

const sortedColors = computed(() => {
	return [...props.colors].sort((a, b) => {
		// Selected colors first
		const aSelected = props.modelValue.includes(a.id)
		const bSelected = props.modelValue.includes(b.id)
		if (aSelected && !bSelected) return -1
		if (!aSelected && bSelected) return 1

		// Then by count (desc)
		if (a.count !== b.count) return b.count - a.count

		// Then by predefined order (common colors first)
		const colorOrder = [
			'branco',
			'preto',
			'prata',
			'cinza',
			'azul',
			'vermelho',
			'verde',
			'amarelo',
			'laranja',
			'roxo'
		]
		const aIndex = colorOrder.indexOf(a.id)
		const bIndex = colorOrder.indexOf(b.id)

		if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
		if (aIndex !== -1) return -1
		if (bIndex !== -1) return 1

		return a.name.localeCompare(b.name)
	})
})

const visibleColors = computed(() => {
	return props.showDetails ? sortedColors.value.slice(0, 6) : []
})

// Methods
const isSelected = (colorId: string): boolean => {
	return props.modelValue.includes(colorId)
}

const toggleColor = (colorId: string) => {
	const color = props.colors.find(c => c.id === colorId)
	if (!color || color.count === 0) return

	let newSelection = [...props.modelValue]

	if (isSelected(colorId)) {
		// Remove color
		newSelection = newSelection.filter(id => id !== colorId)
	} else {
		// Add color (check max selection)
		if (props.maxSelection && newSelection.length >= props.maxSelection) {
			return
		}
		newSelection.push(colorId)
	}

	emit('update:modelValue', newSelection)
	emit(
		'change',
		props.colors.filter(c => newSelection.includes(c.id))
	)
}

const removeColor = (colorId: string) => {
	const newSelection = props.modelValue.filter(id => id !== colorId)
	emit('update:modelValue', newSelection)
	emit(
		'change',
		props.colors.filter(c => newSelection.includes(c.id))
	)
}
</script>
