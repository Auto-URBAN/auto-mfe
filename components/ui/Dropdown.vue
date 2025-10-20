<template>
	<div class="relative inline-block text-left" ref="dropdownRef">
		<!-- Trigger -->
		<div @click="toggle">
			<slot name="trigger">
				<Button
					:variant="triggerVariant"
					:size="triggerSize"
					:icon-right="isOpen ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'"
				>
					{{ triggerText }}
				</Button>
			</slot>
		</div>

		<!-- Dropdown Panel -->
		<Transition
			enter-active-class="transition ease-out duration-100"
			enter-from-class="transform opacity-0 scale-95"
			enter-to-class="transform opacity-100 scale-100"
			leave-active-class="transition ease-in duration-75"
			leave-from-class="transform opacity-100 scale-100"
			leave-to-class="transform opacity-0 scale-95"
		>
			<div v-show="isOpen" :class="panelClasses">
				<div class="py-1">
					<slot name="panel" :close="close" />
				</div>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
interface Props {
	triggerText?: string
	triggerVariant?: 'primary' | 'secondary' | 'outline' | 'ghost'
	triggerSize?: 'xs' | 'sm' | 'md' | 'lg'
	placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'
	disabled?: boolean
}

interface Emits {
	open: []
	close: []
}

const props = withDefaults(defineProps<Props>(), {
	triggerText: 'Options',
	triggerVariant: 'outline',
	triggerSize: 'md',
	placement: 'bottom-start',
	disabled: false
})

const emit = defineEmits<Emits>()

// State
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement>()

// Methods
const toggle = () => {
	if (props.disabled) return
	isOpen.value = !isOpen.value
	if (isOpen.value) {
		emit('open')
	} else {
		emit('close')
	}
}

const close = () => {
	isOpen.value = false
	emit('close')
}

// Computed classes
const panelClasses = computed(() => {
	const base = [
		'absolute z-50 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
	]

	const placements = {
		'bottom-start': 'left-0',
		'bottom-end': 'right-0',
		'top-start': 'left-0 bottom-full mb-2 mt-0',
		'top-end': 'right-0 bottom-full mb-2 mt-0'
	}

	return [...base, placements[props.placement]].join(' ')
})
</script>
