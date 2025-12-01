<template>
	<UiModal
		:model-value="modelValue"
		title="Simular Financiamento"
		size="lg"
		@update:model-value="$emit('update:modelValue', $event)"
	>
		<div class="space-y-6">
			<!-- Dados do Veículo -->
			<div class="bg-gray-50 rounded-lg p-4">
				<h3 class="font-semibold text-gray-900 mb-3">Veículo Selecionado</h3>
				<div class="flex items-center gap-4">
					<img
						:src="vehicle.coverImageUrl"
						:alt="vehicle.title"
						class="w-16 h-12 object-cover rounded-lg"
					/>
					<div>
						<p class="font-semibold">{{ vehicle.brand }} {{ vehicle.model }}</p>
						<p class="text-sm text-gray-600">
							{{ vehicle.year }} • {{ formatCurrency(simulationPrice) }}
						</p>
					</div>
				</div>
			</div>

			<!-- Formulário do Cliente -->
			<div v-if="!isSimulating">
				<h3 class="font-semibold text-gray-900 mb-4">Seus Dados</h3>
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
						<input
							v-model="customerForm.nome"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Seu nome completo"
							required
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">CPF *</label>
						<input
							v-model="customerForm.cpf"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="000.000.000-00"
							required
							@input="formatCpf"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
						<input
							v-model="customerForm.email"
							type="email"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="seu@email.com"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
						<input
							v-model="customerForm.telefone"
							type="tel"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="(11) 99999-9999"
							@input="formatPhone"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
						<input
							v-model="customerForm.dataNascimento"
							type="date"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					<div>
						<label class="block text-sm font-medium text-gray-700 mb-1">Valor de Entrada</label>
						<input
							v-model="entradaDisplay"
							type="text"
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="R$ 0,00"
							@input="formatEntrada"
						/>
					</div>
				</div>

				<div class="flex items-center gap-2 mt-4">
					<input
						id="possuiCNH"
						v-model="customerForm.possuiCNH"
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					/>
					<label for="possuiCNH" class="text-sm text-gray-700">Possuo CNH válida</label>
				</div>
			</div>

			<!-- Simulação em Andamento -->
			<div v-if="isSimulating" class="text-center py-8">
				<div
					class="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"
				/>
				<h3 class="font-semibold text-gray-900 mb-2">
					Simulando em {{ results.length + 1 }}º banco...
				</h3>
				<p class="text-sm text-gray-600">
					Aguarde enquanto consultamos as melhores taxas para você
				</p>

				<!-- Progresso dos Bancos -->
				<div class="mt-6 space-y-2">
					<div
						v-for="result in results"
						:key="result.provider"
						class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
					>
						<span class="font-medium">{{ getBankName(result.provider) }}</span>
						<span
							:class="[
								'text-sm px-2 py-1 rounded',
								result.status === 'ok' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
							]"
						>
							{{ result.status === 'ok' ? 'Simulado' : 'Erro' }}
						</span>
					</div>
				</div>
			</div>

			<!-- Resultados -->
			<div v-if="!isSimulating && results.length > 0" class="space-y-4">
				<h3 class="font-semibold text-gray-900">Resultados da Simulação</h3>

				<!-- Melhor Oferta -->
				<div v-if="bestOffer" class="bg-green-50 border border-green-200 rounded-lg p-4">
					<div class="flex items-center gap-2 mb-2">
						<Icon name="heroicons:star-solid" class="w-5 h-5 text-yellow-500" />
						<span class="font-semibold text-green-900"
							>Melhor Oferta - {{ getBankName(bestOffer.provider) }}</span
						>
					</div>
					<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
						<div
							v-for="parcela in bestOffer.result?.parcelas || []"
							:key="parcela.prazo"
							class="text-center"
						>
							<p class="text-sm text-green-700">{{ parcela.prazo }}x</p>
							<p class="font-bold text-green-900">{{ formatCurrency(parcela.valor) }}</p>
							<p class="text-xs text-green-600">CET: {{ parcela.cet?.toFixed(2) }}%</p>
						</div>
					</div>
				</div>

				<!-- Outras Ofertas -->
				<div class="space-y-3">
					<div
						v-for="result in successfulResults.filter(r => r.provider !== bestOffer?.provider)"
						:key="result.provider"
						class="bg-gray-50 rounded-lg p-4"
					>
						<h4 class="font-semibold text-gray-900 mb-2">{{ getBankName(result.provider) }}</h4>
						<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div
								v-for="parcela in result.result?.parcelas || []"
								:key="parcela.prazo"
								class="text-center"
							>
								<p class="text-sm text-gray-600">{{ parcela.prazo }}x</p>
								<p class="font-bold text-gray-900">{{ formatCurrency(parcela.valor) }}</p>
								<p class="text-xs text-gray-500">CET: {{ parcela.cet?.toFixed(2) }}%</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Erros -->
				<div v-if="errorResults.length > 0" class="bg-yellow-50 rounded-lg p-4">
					<h4 class="font-semibold text-yellow-900 mb-2">Bancos Indisponíveis</h4>
					<div class="space-y-1">
						<p v-for="error in errorResults" :key="error.provider" class="text-sm text-yellow-700">
							{{ getBankName(error.provider) }}:
							{{ error.message || 'Serviço temporariamente indisponível' }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Footer -->
		<template #footer>
			<div class="flex justify-between">
				<UiButton v-if="isSimulating" variant="outline" @click="cancelSimulation">
					Cancelar
				</UiButton>

				<div v-else class="flex gap-3">
					<UiButton variant="outline" @click="$emit('update:modelValue', false)"> Fechar </UiButton>

					<UiButton
						v-if="results.length === 0"
						:disabled="!canStartSimulation"
						@click="handleStartSimulation"
					>
						Iniciar Simulação
					</UiButton>

					<UiButton v-else @click="resetSimulation"> Nova Simulação </UiButton>
				</div>
			</div>
		</template>
	</UiModal>
</template>

<script setup lang="ts">
import type { VehicleSummary, VehicleDetail } from '@/schemas/vehicle'

interface Props {
	modelValue: boolean
	vehicle: VehicleSummary | VehicleDetail
	price?: number
}

interface Emits {
	(e: 'update:modelValue', value: boolean): void
}

const props = defineProps<Props>()
defineEmits<Emits>()

const {
	isSimulating,
	results,
	successfulResults,
	errorResults,
	bestOffer,
	startSimulation,
	cancelSimulation
} = useSimulation()

//Preço da simulação (pode ser diferente do preço do veículo se for um anúncio específico)
const simulationPrice = computed(() => props.price || props.vehicle.price)

//Formulário do cliente
const customerForm = ref({
	nome: '',
	cpf: '',
	email: '',
	telefone: '',
	dataNascimento: '',
	possuiCNH: true
})

//Entrada
const valorEntrada = ref(0)
const entradaDisplay = ref('R$ 0,00')

//Computed para validar se pode iniciar simulação
const canStartSimulation = computed(() => {
	return customerForm.value.nome.length > 2 && customerForm.value.cpf.length >= 11
})

//Funções de formatação
const formatCpf = (event: Event) => {
	const input = event.target as HTMLInputElement
	let value = input.value.replace(/\D/g, '')

	if (value.length >= 11) {
		value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
	} else if (value.length >= 9) {
		value = value.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3')
	} else if (value.length >= 6) {
		value = value.replace(/(\d{3})(\d{3})/, '$1.$2')
	} else if (value.length >= 3) {
		value = value.replace(/(\d{3})/, '$1')
	}

	customerForm.value.cpf = value
}

const formatPhone = (event: Event) => {
	const input = event.target as HTMLInputElement
	let value = input.value.replace(/\D/g, '')

	if (value.length >= 11) {
		value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
	} else if (value.length >= 7) {
		value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
	} else if (value.length >= 3) {
		value = value.replace(/(\d{2})(\d{4})/, '($1) $2')
	} else if (value.length >= 1) {
		value = value.replace(/(\d{2})/, '($1')
	}

	customerForm.value.telefone = value
}

const formatEntrada = (event: Event) => {
	const input = event.target as HTMLInputElement
	const rawValue = input.value.replace(/[^\d]/g, '')
	const numValue = parseInt(rawValue) || 0

	valorEntrada.value = numValue / 100
	entradaDisplay.value = formatCurrency(valorEntrada.value)
}

const formatCurrency = (value: number): string => {
	return new Intl.NumberFormat('pt-BR', {
		style: 'currency',
		currency: 'BRL',
		minimumFractionDigits: 2
	}).format(value)
}

const getBankName = (provider: string): string => {
	const names: Record<string, string> = {
		SAFRA: 'Banco Safra',
		BV: 'Banco BV',
		SANTANDER: 'Santander',
		BANCO_PAN: 'Banco Pan',
		PORTO_SEGURO: 'Porto Seguro'
	}
	return names[provider] || provider
}

//Função para iniciar simulação
const handleStartSimulation = async () => {
	try {
		await startSimulation(
			props.vehicle,
			{
				nome: customerForm.value.nome,
				cpf: customerForm.value.cpf.replace(/\D/g, ''),
				email: customerForm.value.email,
				telefone: customerForm.value.telefone.replace(/\D/g, ''),
				dataNascimento: customerForm.value.dataNascimento,
				possuiCNH: customerForm.value.possuiCNH
			},
			{
				valorEntrada: valorEntrada.value,
				percentualEntrada: (valorEntrada.value / simulationPrice.value) * 100,
				prazosDesejados: [24, 36, 48, 60]
			},
			simulationPrice.value
		)
	} catch (error) {
		console.error('Erro ao iniciar simulação:', error)
	}
}

//Resetar simulação
const resetSimulation = () => {
	//TODO: implementar limpeza dos results quando useSimulation estiver disponível
	//results.value = []
}

//Limpar formulário quando fechar modal
watch(
	() => props.modelValue,
	newValue => {
		if (!newValue) {
			//Reset form after a delay to avoid visual glitch
			setTimeout(() => {
				customerForm.value = {
					nome: '',
					cpf: '',
					email: '',
					telefone: '',
					dataNascimento: '',
					possuiCNH: true
				}
				valorEntrada.value = 0
				entradaDisplay.value = 'R$ 0,00'
				//TODO: implementar limpeza dos results quando useSimulation estiver disponível
				//results.value = []
			}, 300)
		}
	}
)
</script>
