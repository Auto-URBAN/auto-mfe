<template>
  <div class="space-y-3">
    <!-- Input Fields - More compact grid -->
    <div class="grid grid-cols-6 gap-2 text-xs">
      <div class="col-span-2">
        <label class="block text-gray-600 mb-1 text-[10px] font-medium">VALOR</label>
        <input
          v-model="vehicleValueFormatted"
          type="text"
          class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="R$ 50.000"
        />
      </div>
      
      <div class="col-span-2">
        <label class="block text-gray-600 mb-1 text-[10px] font-medium">ENTRADA</label>
        <input
          v-model="downPaymentFormatted"
          type="text"
          class="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder="R$ 10.000"
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
          <span class="font-medium text-gray-700 font-mono">{{ formatCurrency(financedAmount) }}</span>
        </div>
        
        <div class="flex justify-between items-center bg-blue-100 -mx-1 px-1 py-1 rounded">
          <div class="flex items-center space-x-1.5">
            <Icon name="heroicons:banknotes" class="w-3 h-3 text-blue-600" />
            <span class="text-blue-600 font-medium">Parcela mensal:</span>
          </div>
          <span class="font-bold text-blue-700 text-sm font-mono">{{ formatCurrency(monthlyPayment) }}</span>
        </div>
        
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-1.5">
            <Icon name="heroicons:receipt-percent" class="w-3 h-3 text-red-500" />
            <span class="text-gray-500">Total de juros:</span>
          </div>
          <span class="font-medium text-red-600 font-mono">{{ formatCurrency(totalInterest) }}</span>
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

// Formatted inputs for money
const vehicleValueFormatted = computed({
  get: () => formatCurrency(vehicleValue.value),
  set: (val: string) => {
    const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'))
    vehicleValue.value = isNaN(num) ? 0 : num
  }
})

const downPaymentFormatted = computed({
  get: () => formatCurrency(downPayment.value),
  set: (val: string) => {
    const num = parseFloat(val.replace(/[^\d,.-]/g, '').replace(',', '.'))
    downPayment.value = isNaN(num) ? 0 : num
  }
})

// Watch price changes
watch(() => props.price, (newPrice) => {
  vehicleValue.value = newPrice
  downPayment.value = Math.round(newPrice * 0.2)
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
  return downPayment.value + (monthlyPayment.value * months.value)
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