<template>
	<div class="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
		<!-- Header Compacto -->
		<div class="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3">
			<h3 class="text-base lg:text-lg font-bold text-white">Simule seu Financiamento</h3>
		</div>

		<div class="p-4 space-y-4">
			<!-- Row 1: Valor + Taxa/Banco lado a lado -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
				<!-- Valor do Veículo -->
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5">Valor do Veículo</label>
					<input
						v-model="vehicleValueDisplay"
						type="text"
						class="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
						placeholder="R$ 50.000"
						@input="updateVehicleValue"
						@focus="handleFocus('vehicle')"
						@blur="handleBlur('vehicle')"
					/>
				</div>

				<!-- Taxa de Juros / Banco -->
				<div>
					<label class="block text-xs font-semibold text-gray-600 mb-1.5">Taxa de Juros</label>
					<div class="flex gap-2">
						<select
							v-model="selectedBank"
							class="flex-1 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
							@change="updateInterestRate"
						>
							<option value="custom">Personalizada</option>
							<option
								v-for="bank in bankOptions.filter(b => b.id !== 'custom')"
								:key="bank.id"
								:value="bank.id"
							>
								{{ bank.name }} ({{ bank.rate }}%)
							</option>
						</select>
						<input
							v-if="selectedBank === 'custom'"
							v-model.number="interestRate"
							type="number"
							step="0.1"
							min="0"
							max="5"
							class="w-20 px-3 py-2.5 bg-amber-50 border border-amber-300 rounded-lg text-gray-800 font-semibold text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
							placeholder="1.5"
						/>
					</div>
				</div>
			</div>

			<!-- Valor de Entrada com Slider -->
			<div class="bg-gray-50 border border-gray-200 rounded-xl p-3">
				<div class="flex justify-between items-center mb-2">
					<div class="flex items-center gap-2">
						<Icon name="heroicons:banknotes" class="w-4 h-4 text-green-600" />
						<span class="text-xs font-semibold text-gray-600">Entrada</span>
					</div>
					<div class="flex items-center gap-2">
						<input
							v-model="downPaymentDisplay"
							type="text"
							class="w-28 px-2 py-1 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-900 text-right focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							@input="updateDownPaymentFromValue"
							@focus="handleDownPaymentFocus"
							@blur="handleDownPaymentBlur"
						/>
						<input
							v-model.number="downPaymentPercentage"
							type="number"
							min="0"
							max="100"
							class="w-14 px-2 py-1 bg-blue-100 border border-blue-200 rounded-full text-xs font-bold text-blue-600 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
							@input="updateDownPaymentDisplay"
						/>
						<span class="text-xs font-bold text-blue-600">%</span>
					</div>
				</div>

				<!-- Range Slider -->
				<div class="relative">
					<input
						v-model.number="downPaymentPercentage"
						type="range"
						:min="minDownPaymentPercent"
						:max="maxDownPaymentPercent"
						step="1"
						class="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
						@input="updateDownPaymentDisplay"
					/>
					<div
						class="absolute top-0 left-0 h-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg pointer-events-none"
						:style="{ width: sliderProgress + '%' }"
					/>
				</div>

				<div class="flex justify-between text-[10px] text-gray-400 mt-1">
					<span>{{ minDownPaymentPercent }}%</span>
					<span>{{ maxDownPaymentPercent }}%</span>
				</div>
			</div>

			<!-- Opções de Prazo - Cards Compactos -->
			<div>
				<label class="block text-xs font-semibold text-gray-600 mb-2">Prazo</label>
				<div class="flex gap-1.5 overflow-x-auto pb-1">
					<button
						v-for="option in installmentOptions"
						:key="option"
						type="button"
						:class="[
							'flex-1 min-w-[60px] py-2 px-1 rounded-lg border transition-all duration-200 text-center',
							months === option
								? 'border-blue-500 bg-blue-50 text-blue-700'
								: 'border-gray-200 bg-white text-gray-600 hover:border-blue-300'
						]"
						@click="months = option"
					>
						<span class="block text-[10px] text-gray-500">{{ option }}x de</span>
						<span class="block text-xs font-bold"
							>R$ {{ formatCurrencyCompact(calculatePayment(option)) }}</span
						>
					</button>
				</div>
			</div>
		</div>

		<!-- Resultado da Simulação - Compacto -->
		<div class="bg-gray-50 border-t border-gray-200 p-4">
			<!-- Parcela em destaque -->
			<div class="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-3 mb-3">
				<div class="flex justify-between items-center">
					<span class="text-xs font-medium text-white/90">Parcela</span>
					<span class="text-xl lg:text-2xl font-black text-white">{{
						formatCurrency(monthlyPayment)
					}}</span>
				</div>
			</div>

			<!-- Grid de informações compacto -->
			<div class="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-gray-500 text-xs">Valor Financiado</span>
					<span class="font-semibold text-blue-600 text-xs">{{
						formatCurrency(financedAmount)
					}}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500 text-xs">Valor Total</span>
					<span class="font-semibold text-gray-900 text-xs">{{ formatCurrency(totalAmount) }}</span>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500 text-xs">Taxa de Juros</span>
					<span class="font-semibold text-orange-600 text-xs"
						>{{ interestRate.toFixed(2) }}% a.m. ({{ annualRate }}% a.a.)</span
					>
				</div>
				<div class="flex justify-between">
					<span class="text-gray-500 text-xs">Taxa CET</span>
					<span class="font-semibold text-gray-900 text-xs"
						>{{ monthlyCET }}% a.m. ({{ annualCET }}% a.a.)</span
					>
				</div>
			</div>

			<!-- Info do banco selecionado -->
			<div
				v-if="selectedBank !== 'custom' && getBankInfo(selectedBank)?.note"
				class="mt-3 flex items-center gap-2 bg-blue-50 rounded-lg p-2 border border-blue-100"
			>
				<Icon name="heroicons:information-circle" class="w-4 h-4 text-blue-600 flex-shrink-0" />
				<p class="text-xs text-blue-700">{{ getBankInfo(selectedBank)?.note }}</p>
			</div>
		</div>

		<!-- Disclaimer Minimalista -->
		<div class="bg-gray-100 px-4 py-2 border-t border-gray-200">
			<p class="text-[10px] text-gray-400 text-center">
				Valores estimados • Consulte as instituições para condições oficiais
			</p>
		</div>
	</div>
</template>

<script setup lang="ts">
interface BankOption {
	id: string
	name: string
	rate: number
	note?: string
}

const vehicleValue = ref(0)
const downPaymentPercentage = ref(0)
const months = ref(48)
const interestRate = ref(1.5)
const selectedBank = ref('custom')

//Configurações do slider
const minDownPaymentPercent = 0
const maxDownPaymentPercent = 100

//Opções de parcelamento
const installmentOptions = [12, 24, 36, 48, 60]
const bankOptions: BankOption[] = [
	{
		id: 'bb',
		name: 'Banco do Brasil',
		rate: 1.49
	},
	{
		id: 'bradesco',
		name: 'Bradesco',
		rate: 1.55
	},
	{
		id: 'itau',
		name: 'Itaú',
		rate: 1.59
	},
	{
		id: 'santander',
		name: 'Santander',
		rate: 1.69
	},
	{
		id: 'consorcio',
		name: 'Consórcio',
		rate: 0
	}
]

//Computed values
const downPayment = computed(() => {
	return (vehicleValue.value * downPaymentPercentage.value) / 100
})

const sliderProgress = computed(() => {
	return (
		((downPaymentPercentage.value - minDownPaymentPercent) /
			(maxDownPaymentPercent - minDownPaymentPercent)) *
		100
	)
})

const financedAmount = computed(() => {
	return Math.max(0, vehicleValue.value - downPayment.value)
})

const monthlyPayment = computed(() => {
	return calculatePayment(months.value)
})

const totalAmount = computed(() => {
	return monthlyPayment.value * months.value
})

const monthlyCET = computed(() => {
	return (interestRate.value * 1.2).toFixed(2)
})

const annualRate = computed(() => {
	return ((Math.pow(1 + interestRate.value / 100, 12) - 1) * 100).toFixed(2)
})

const annualCET = computed(() => {
	return ((Math.pow(1 + (interestRate.value * 1.2) / 100, 12) - 1) * 100).toFixed(2)
})

//Funções
const calculatePayment = (numMonths: number) => {
	if (financedAmount.value <= 0) {
		return 0
	}
	if (interestRate.value <= 0) {
		return Math.round((financedAmount.value / numMonths) * 100) / 100
	}
	const rate = interestRate.value / 100
	const factor = Math.pow(1 + rate, numMonths)
	const payment = (financedAmount.value * rate * factor) / (factor - 1)
	return Math.round(payment * 100) / 100
}

const getBankInfo = (bankId: string) => {
	return bankOptions.find((bank: BankOption) => bank.id === bankId)
}

const updateInterestRate = () => {
	if (selectedBank.value !== 'custom') {
		const bank = getBankInfo(selectedBank.value)
		if (bank) {
			interestRate.value = bank.rate
		}
	}
}

//Display values para inputs
const vehicleValueDisplay = ref('')
const downPaymentDisplay = ref('')
const focusState = ref({ vehicle: false, downPayment: false })

//Função para formatar valor como moeda brasileira (R$ 1.234,56)
const formatMoneyInput = (value: number): string => {
	if (!value && value !== 0) return ''
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(value / 100)
}

//Função para extrair valor numérico (em centavos) de string formatada
const parseMoneyInput = (value: string): number => {
	const cleanValue = value.replace(/[^\d]/g, '')
	return parseInt(cleanValue) || 0
}

//Função para aplicar máscara monetária enquanto digita
const applyMoneyMask = (event: Event, field: 'vehicle' | 'downPayment') => {
	const input = event.target as HTMLInputElement
	const cursorPos = input.selectionStart || 0
	const oldLength = input.value.length

	//Extrai apenas números
	const rawValue = parseMoneyInput(input.value)

	//Formata o valor
	const formatted = formatMoneyInput(rawValue)

	//Atualiza o display
	if (field === 'vehicle') {
		vehicleValueDisplay.value = formatted
		vehicleValue.value = rawValue / 100
	} else {
		downPaymentDisplay.value = formatted

		//Calcula a porcentagem baseada no valor digitado
		if (vehicleValue.value > 0) {
			const entryValue = rawValue / 100
			const percentage = (entryValue / vehicleValue.value) * 100
			downPaymentPercentage.value = Math.min(100, Math.max(0, percentage))
		}
	}

	//Ajusta posição do cursor
	nextTick(() => {
		const newLength = formatted.length
		const diff = newLength - oldLength
		const newPos = Math.max(0, cursorPos + diff)
		input.setSelectionRange(newPos, newPos)
	})
}

const initializeDisplayValues = () => {
	vehicleValueDisplay.value = formatCurrency(vehicleValue.value)
	downPaymentDisplay.value = formatCurrency(downPayment.value)
}

const updateDownPaymentDisplay = () => {
	if (!focusState.value.downPayment) {
		downPaymentDisplay.value = formatCurrency(downPayment.value)
	}
}

const handleVehicleFocus = () => {
	focusState.value.vehicle = true
	//Mantém formatado mas seleciona tudo para facilitar edição
	vehicleValueDisplay.value = formatMoneyInput(vehicleValue.value * 100)
}

const handleVehicleBlur = () => {
	focusState.value.vehicle = false
	vehicleValueDisplay.value = formatCurrency(vehicleValue.value)
}

const handleDownPaymentFocus = () => {
	focusState.value.downPayment = true
	downPaymentDisplay.value = formatMoneyInput(downPayment.value * 100)
}

const handleDownPaymentBlur = () => {
	focusState.value.downPayment = false
	downPaymentDisplay.value = formatCurrency(downPayment.value)
}

const updateDownPaymentFromValue = (event: Event) => {
	applyMoneyMask(event, 'downPayment')
}

const updateVehicleValue = (event: Event) => {
	applyMoneyMask(event, 'vehicle')
}

//Função legada mantida para compatibilidade
const handleFocus = (field: 'vehicle') => {
	if (field === 'vehicle') {
		handleVehicleFocus()
	}
}

const handleBlur = (field: 'vehicle') => {
	if (field === 'vehicle') {
		handleVehicleBlur()
	}
}

const formatCurrency = (value: number) => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL'
	}).format(value || 0)
}

const formatCurrencyCompact = (value: number) => {
	if (!value || isNaN(value) || !isFinite(value)) {
		return '0'
	}
	if (value >= 1000) {
		const k = value / 1000
		return k >= 10 ? `${Math.round(k)}k` : `${k.toFixed(1).replace('.', ',')}k`
	}
	return Math.round(value).toString()
}

//Watchers
watch(downPayment, () => {
	updateDownPaymentDisplay()
})

watch(vehicleValue, () => {
	updateDownPaymentDisplay()
})

//Initialize
onMounted(() => {
	initializeDisplayValues()
})
</script>

<style scoped>
.slider-blue::-webkit-slider-thumb {
	-webkit-appearance: none;
	appearance: none;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: linear-gradient(135deg, #3b82f6, #1d4ed8);
	cursor: pointer;
	border: 2px solid white;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
	position: relative;
	z-index: 10;
}

.slider-blue::-moz-range-thumb {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: linear-gradient(135deg, #3b82f6, #1d4ed8);
	cursor: pointer;
	border: 2px solid white;
	box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
}

.slider-blue::-webkit-slider-runnable-track {
	background: transparent;
}

.slider-blue::-moz-range-track {
	background: transparent;
}
</style>
