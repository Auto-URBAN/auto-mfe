<template>
	<div class="w-full">
		<label v-if="label" :for="selectId" class="block text-sm font-medium text-gray-700 mb-1">
			{{ label }}
			<span v-if="required" class="text-red-500 ml-1">*</span>
		</label>

		<div class="relative">
			<select
				:id="selectId"
				:disabled="disabled"
				:required="required"
				:class="selectClasses"
				:value="modelValue"
				@change="handleChange"
			>
				<option v-if="placeholder" value="" disabled>
					{{ placeholder }}
				</option>
				<option
					v-for="option in normalizedOptions"
					:key="option.value"
					:value="option.value"
					:disabled="option.disabled"
				>
					{{ option.label }}
				</option>
			</select>

			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<Icon name="heroicons:chevron-down-20-solid" class="h-4 w-4 text-gray-400" />
			</div>
		</div>

		<p v-if="helperText" class="mt-1 text-sm text-gray-500">
			{{ helperText }}
		</p>

		<p v-if="error" class="mt-1 text-sm text-red-600">
			{{ error }}
		</p>
	</div>
</template>

<script setup lang="ts">
interface SelectOption {
	label: string
	value: string | number
	disabled?: boolean
}

interface Props {
	modelValue?: string | number
	options: (SelectOption | string | number)[]
	label?: string
	placeholder?: string
	disabled?: boolean
	required?: boolean
	error?: string
	helperText?: string
	size?: 'sm' | 'md' | 'lg'
}

interface Emits {
	'update:modelValue': [value: string | number]
}

const props = withDefaults(defineProps<Props>(), {
	size: 'md',
	disabled: false,
	required: false
})

const emit = defineEmits<Emits>()

const selectId = computed(() => `select-${Math.random().toString(36).substr(2, 9)}`)

const normalizedOptions = computed(() => {
	return props.options.map(option => {
		if (typeof option === 'string' || typeof option === 'number') {
			return {
				label: String(option),
				value: option,
				disabled: false
			}
		}
		return option
	})
})

const handleChange = (event: Event) => {
	const target = event.target as HTMLSelectElement
	const value = target.value
	emit('update:modelValue', value)
}

const selectClasses = computed(() => {
	const base = [
		'block w-full rounded-lg border appearance-none bg-white transition-colors duration-200',
		'focus:outline-none focus:ring-2 focus:ring-offset-0',
		'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
	]

	const sizes = {
		sm: 'px-3 py-2 pr-8 text-sm',
		md: 'px-3 py-2.5 pr-8 text-sm',
		lg: 'px-4 py-3 pr-10 text-base'
	}

	const states = props.error
		? 'border-red-300 focus:border-red-500 focus:ring-red-500'
		: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'

	return [...base, sizes[props.size], states].join(' ')
})
</script>
