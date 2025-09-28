<template>
  <div class="space-y-4">
    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Valor do veículo
        </label>
        <input
          v-model.number="vehicleValue"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          :placeholder="formatCurrency(price)"
        />
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Entrada
        </label>
        <input
          v-model.number="downPayment"
          type="number"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="0"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Prazo
        </label>
        <select
          v-model.number="months"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          <option value="12">12 meses</option>
          <option value="24">24 meses</option>
          <option value="36">36 meses</option>
          <option value="48">48 meses</option>
          <option value="60">60 meses</option>
        </select>
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          Taxa (% a.m.)
        </label>
        <input
          v-model.number="interestRate"
          type="number"
          step="0.1"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="1.5"
        />
      </div>
    </div>

    <!-- Results -->
    <div class="bg-gray-50 rounded-lg p-4 mt-4">
      <h4 class="font-medium text-gray-900 mb-3">Simulação:</h4>
      
      <div class="space-y-2 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Valor financiado:</span>
          <span class="font-medium">{{ formatCurrency(financedAmount) }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Parcela mensal:</span>
          <span class="font-semibold text-blue-600 text-base">{{ formatCurrency(monthlyPayment) }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Total a pagar:</span>
          <span class="font-medium">{{ formatCurrency(totalAmount) }}</span>
        </div>
        
        <div class="flex justify-between">
          <span class="text-gray-600">Total de juros:</span>
          <span class="font-medium text-red-600">{{ formatCurrency(totalInterest) }}</span>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-500 mt-2">
      * Simulação apenas para fins informativos. Consulte seu banco para condições reais.
    </div>
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

// Utility function
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0)
}
</script>