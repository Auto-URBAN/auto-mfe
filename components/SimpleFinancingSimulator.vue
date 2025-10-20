<template>
	<div class="space-y-3">
		<!-- Input Fields - More compact grid -->
		<div class="grid grid-cols-4 gap-2 text-xs">
			<div>
				<label class="block text-gray-600 mb-1 text-[10px] font-medium">VALOR</label>
				<input
					v-model="vehicleValueDisplay"
					@input="updateVehicleValue"
					@focus="handleFocus('vehicle')"
					@blur="handleBlur('vehicle')"
					type="text"
					class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
					placeholder="R$ 50k"
				/>
			</div>

			<div>
				<label class="block text-gray-600 mb-1 text-[10px] font-medium">ENTRADA</label>
				<input
					v-model="downPaymentDisplay"
					@input="updateDownPayment"
					@focus="handleFocus('down')"
					@blur="handleBlur('down')"
					type="text"
					class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
					placeholder="R$ 10k"
				/>
			</div>

			<div>
				<label class="block text-gray-600 mb-1 text-[10px] font-medium">MESES</label>
				<select
					v-model.number="months"
					class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
				>
					<option value="12">12</option>
					<option value="24">24</option>
					<option value="36">36</option>
					<option value="48">48</option>
					<option value="60">60</option>
				</select>
			</div>

			<div>
				<label class="block text-gray-600 mb-1 text-[10px] font-medium">% MÊS</label>
				<input
					v-model.number="interestRate"
					type="number"
					step="0.1"
					class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
					placeholder="1.5"
				/>
			</div>
		</div>

		<!-- Results - Compact display -->
		<div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md p-3 border border-blue-100">
			<div class="space-y-1.5 text-xs">
				<div class="flex justify-between items-center">
					<div class="flex items-center space-x-1.5">
						<Icon name="heroicons:calculator" class="w-3 h-3 text-gray-500" />
						<span class="text-gray-500">Financiado:</span>
					</div>
					<span class="font-medium text-gray-700 font-mono">{{
						formatCurrency(financedAmount)
					}}</span>
				</div>

				<div class="flex justify-between items-center bg-blue-100 -mx-1 px-1 py-1 rounded">
					<div class="flex items-center space-x-1.5">
						<Icon name="heroicons:banknotes" class="w-3 h-3 text-blue-600" />
						<span class="text-blue-600 font-medium">Parcela mensal:</span>
					</div>
					<span class="font-bold text-blue-700 text-sm font-mono">{{
						formatCurrency(monthlyPayment)
					}}</span>
				</div>

				<div class="flex justify-between items-center">
					<div class="flex items-center space-x-1.5">
						<Icon name="heroicons:receipt-percent" class="w-3 h-3 text-red-500" />
						<span class="text-gray-500">Total de juros:</span>
					</div>
					<span class="font-medium text-red-600 font-mono">{{
						formatCurrency(totalInterest)
					}}</span>
				</div>

				<div class="flex justify-between items-center">
					<div class="flex items-center space-x-1.5">
						<Icon name="heroicons:credit-card" class="w-3 h-3 text-gray-500" />
						<span class="text-gray-500">Total a pagar:</span>
					</div>
					<span class="font-medium text-gray-700 font-mono">{{ formatCurrency(totalAmount) }}</span>
				</div>

				<div class="flex justify-between items-center pt-1 border-t border-blue-200">
					<div class="flex items-center space-x-1.5">
						<Icon name="heroicons:currency-dollar" class="w-3 h-3 text-green-600" />
						<span class="text-green-600 font-medium">Valor total:</span>
					</div>
					<span class="font-bold text-green-700 font-mono">{{ formatCurrency(grandTotal) }}</span>
				</div>
			</div>
		</div>

		<p class="text-[10px] text-gray-400 leading-tight">
			* Simulação informativa. Consulte seu banco para condições reais.
		</p>
	</div>
</template>

<script setup lang="ts">
interface Props {
	price: number
}

const props = defineProps<Props>()

// Reactive data
const vehicleValue = ref(props.price)
const downPayment = ref(Math.round(props.price * 0.2)) // 20% default
const months = ref(48)
const interestRate = ref(1.5) // 1.5% per month default

// Display values for inputs (more fluid UX)
const vehicleValueDisplay = ref('')
const downPaymentDisplay = ref('')
const focusState = ref({ vehicle: false, down: false })

// Initialize display values
const initializeDisplayValues = () => {
	vehicleValueDisplay.value = formatDisplayValueWithCurrency(vehicleValue.value)
	downPaymentDisplay.value = formatDisplayValueWithCurrency(downPayment.value)
}

// Handle focus events
const handleFocus = (field: 'vehicle' | 'down') => {
	focusState.value[field] = true
	// Show raw number when focused
	if (field === 'vehicle') {
		vehicleValueDisplay.value = vehicleValue.value.toString()
	} else {
		downPaymentDisplay.value = downPayment.value.toString()
	}
}

// Handle blur events
const handleBlur = (field: 'vehicle' | 'down') => {
	focusState.value[field] = false
	// Format display when not focused
	if (field === 'vehicle') {
		vehicleValueDisplay.value = formatDisplayValueWithCurrency(vehicleValue.value)
	} else {
		downPaymentDisplay.value = formatDisplayValueWithCurrency(downPayment.value)
	}
}

// Update vehicle value
const updateVehicleValue = (event: Event) => {
	const input = event.target as HTMLInputElement
	const cleanValue = input.value.replace(/[^\d]/g, '')
	const numValue = parseInt(cleanValue) || 0
	vehicleValue.value = numValue
	vehicleValueDisplay.value = focusState.value.vehicle
		? numValue.toString()
		: formatDisplayValueWithCurrency(numValue)
}

// Update down payment
const updateDownPayment = (event: Event) => {
	const input = event.target as HTMLInputElement
	const cleanValue = input.value.replace(/[^\d]/g, '')
	const numValue = parseInt(cleanValue) || 0
	downPayment.value = numValue
	downPaymentDisplay.value = focusState.value.down
		? numValue.toString()
		: formatDisplayValueWithCurrency(numValue)
}

// Format display value (compact, user-friendly)
const formatDisplayValue = (value: number) => {
	if (value === 0) return ''
	if (value >= 1000) {
		return `${(value / 1000).toFixed(0)}k`
	}
	return value.toString()
}

// Format display value with currency
const formatDisplayValueWithCurrency = (value: number) => {
	if (value === 0) return ''
	if (value >= 1000000) {
		const mValue = (value / 1000000).toFixed(1)
		return `R$ ${mValue.endsWith('.0') ? mValue.slice(0, -2) : mValue}M`
	} else if (value >= 1000) {
		const kValue = (value / 1000).toFixed(0)
		return `R$ ${kValue}k`
	}
	return `R$ ${value.toString()}`
}

// Watch price changes
watch(
	() => props.price,
	newPrice => {
		vehicleValue.value = newPrice
		downPayment.value = Math.round(newPrice * 0.2)
		initializeDisplayValues()
	}
)

// Initialize on mount
onMounted(() => {
	initializeDisplayValues()
})

// Computed values
const financedAmount = computed(() => {
	return Math.max(0, vehicleValue.value - downPayment.value)
})

const monthlyPayment = computed(() => {
	if (financedAmount.value <= 0 || interestRate.value <= 0) {
		return financedAmount.value / months.value
	}

	const rate = interestRate.value / 100
	const factor = Math.pow(1 + rate, months.value)
	const payment = (financedAmount.value * rate * factor) / (factor - 1)

	return Math.round(payment * 100) / 100
})

const totalAmount = computed(() => {
	return downPayment.value + monthlyPayment.value * months.value
})

const totalInterest = computed(() => {
	return totalAmount.value - vehicleValue.value
})

const grandTotal = computed(() => {
	return downPayment.value + totalAmount.value
})

// Utility functions
const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(value || 0)
}

const formatCompactCurrency = (value: number) => {
	const num = value || 0
	if (num >= 1000000) {
		return `R$ ${(num / 1000000).toFixed(1)}M`
	} else if (num >= 1000) {
		const kValue = (num / 1000).toFixed(1)
		// Remove .0 desnecessário
		return `R$ ${kValue.endsWith('.0') ? kValue.slice(0, -2) : kValue}k`
	}
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	}).format(num)
}
</script>
