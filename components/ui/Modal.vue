<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition ease-out duration-300"
			enter-from-class="opacity-0"
			enter-to-class="opacity-100"
			leave-active-class="transition ease-in duration-200"
			leave-from-class="opacity-100"
			leave-to-class="opacity-0"
		>
			<div
				v-if="modelValue"
				class="fixed inset-0 z-50 overflow-y-auto"
				@click="handleBackdropClick"
			>
				<div class="fixed inset-0 bg-black bg-opacity-50" />

				<div class="flex min-h-screen items-center justify-center p-4">
					<Transition
						enter-active-class="transition ease-out duration-300"
						enter-from-class="opacity-0 scale-95"
						enter-to-class="opacity-100 scale-100"
						leave-active-class="transition ease-in duration-200"
						leave-from-class="opacity-100 scale-100"
						leave-to-class="opacity-0 scale-95"
					>
						<div v-if="modelValue" :class="modalClasses" @click.stop>
							<div
								v-if="$slots.header || title"
								class="flex items-center justify-between p-6 border-b border-gray-200"
							>
								<slot name="header">
									<h3 v-if="title" class="text-lg font-semibold text-gray-900">
										{{ title }}
									</h3>
								</slot>

								<button
									v-if="closable"
									type="button"
									class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
									@click="close"
								>
									<Icon name="heroicons:x-mark-20-solid" class="w-5 h-5" />
								</button>
							</div>

							<div :class="contentClasses">
								<slot />
							</div>

							<div
								v-if="$slots.footer"
								class="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50"
							>
								<slot name="footer" :close="close" />
							</div>
						</div>
					</Transition>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
interface Props {
	modelValue: boolean
	title?: string
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
	closable?: boolean
	closeOnBackdrop?: boolean
}

interface Emits {
	'update:modelValue': [value: boolean]
	close: []
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	closable: true,
	closeOnBackdrop: true
})

const emit = defineEmits<Emits>()

const close = () => {
	emit('update:modelValue', false)
	emit('close')
}

const handleBackdropClick = () => {
	if (props.closeOnBackdrop) {
		close()
	}
}

const modalClasses = computed(() => {
	const base = [
		'relative bg-white rounded-lg shadow-xl transition-all',
		'w-full max-h-[calc(100vh-2rem)]',
		'flex flex-col'
	]

	const sizes = {
		xs: 'max-w-xs',
		sm: 'max-w-sm',
		md: 'max-w-md',
		lg: 'max-w-2xl',
		xl: 'max-w-4xl',
		full: 'max-w-7xl'
	}

	return [...base, sizes[props.size]].join(' ')
})

const contentClasses = computed(() => {
	return 'flex-1 overflow-y-auto p-6'
})

watch(
	() => props.modelValue,
	isOpen => {
		if (process.client) {
			if (isOpen) {
				document.body.style.overflow = 'hidden'
			} else {
				document.body.style.overflow = ''
			}
		}
	}
)

onUnmounted(() => {
	if (process.client) {
		document.body.style.overflow = ''
	}
})
</script>
