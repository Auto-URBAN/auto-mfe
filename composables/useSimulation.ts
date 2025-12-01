import type { VehicleSummary, VehicleDetail } from '@/schemas/vehicle'

interface SimulationCustomer {
	nome: string
	cpf: string
	email: string
	telefone: string
	dataNascimento: string
	tipoPessoa: 'FISICA' | 'JURIDICA'
	possuiCNH: boolean
}

interface SimulationVehicle {
	tipo: 'CARRO' | 'MOTO'
	marca: string
	modelo: string
	versao?: string
	anoModelo: string
	combustivel: string
	valor: number
}

interface SimulationFinancing {
	valorEntrada: number
	percentualEntrada: number
	prazosDesejados: number[]
}

interface SimulationRequest {
	providers: string[]
	customer: SimulationCustomer
	vehicle: SimulationVehicle
	financing: SimulationFinancing
}

interface SimulationResult {
	provider: string
	status: 'ok' | 'error' | 'timeout'
	result?: {
		banco: string
		taxaJuros: number
		parcelas: Array<{
			prazo: number
			valor: number
			cet: number
		}>
		observacoes?: string
	}
	message?: string
	error?: string
}

export const useSimulation = () => {
	const isSimulating = ref(false)
	const results = ref<SimulationResult[]>([])
	const currentEventSource = ref<EventSource | null>(null)

	//Função para criar dados do veículo baseado no objeto vehicle
	const createVehicleFromData = (
		vehicle: VehicleSummary | VehicleDetail,
		price?: number
	): SimulationVehicle => {
		const vehiclePrice = price || vehicle.price

		return {
			tipo: 'CARRO' as const,
			marca: vehicle.brand,
			modelo: vehicle.model,
			versao: '',
			anoModelo: `${vehicle.year}/${vehicle.year}`,
			combustivel: (vehicle as VehicleDetail).fuel || 'Flex',
			valor: vehiclePrice
		}
	}

	//Função para iniciar simulação
	const startSimulation = async (
		vehicleData: VehicleSummary | VehicleDetail,
		customerData: Partial<SimulationCustomer>,
		financingData: Partial<SimulationFinancing>,
		price?: number
	): Promise<void> => {
		if (isSimulating.value) {
			throw new Error('Simulação já está em andamento')
		}

		//Validações básicas
		if (!customerData.nome || !customerData.cpf) {
			throw new Error('Nome e CPF são obrigatórios')
		}

		const simulationData: SimulationRequest = {
			providers: ['SAFRA', 'BV', 'SANTANDER', 'BANCO_PAN', 'PORTO_SEGURO'],
			customer: {
				nome: customerData.nome,
				cpf: customerData.cpf,
				email: customerData.email || `${customerData.cpf}@temporario.com`,
				telefone: customerData.telefone || '(11) 99999-9999',
				dataNascimento: customerData.dataNascimento || '1990-01-01',
				tipoPessoa: customerData.tipoPessoa || 'FISICA',
				possuiCNH: customerData.possuiCNH ?? true
			},
			vehicle: createVehicleFromData(vehicleData, price),
			financing: {
				valorEntrada: financingData.valorEntrada || 0,
				percentualEntrada: financingData.percentualEntrada || 0,
				prazosDesejados: financingData.prazosDesejados || [24, 36, 48, 60]
			}
		}

		//Limpar resultados anteriores
		results.value = []
		isSimulating.value = true

		const simulationBotUrl = 'http://localhost:3001'
		const queryParams = new URLSearchParams({
			data: JSON.stringify(simulationData)
		})

		try {
			const eventSource = new EventSource(
				`${simulationBotUrl}/simulate-stream?${queryParams.toString()}`
			)
			currentEventSource.value = eventSource

			eventSource.addEventListener('simulation_started', event => {
				const data = JSON.parse(event.data)
				console.log('Simulação iniciada:', data)
			})

			eventSource.addEventListener('provider_result', event => {
				const data = JSON.parse(event.data) as SimulationResult
				console.log(`Resultado do ${data.provider}:`, data)
				results.value.push(data)
			})

			eventSource.addEventListener('provider_error', event => {
				const data = JSON.parse(event.data) as SimulationResult
				console.error(`Erro no ${data.provider}:`, data.message)
				results.value.push(data)
			})

			eventSource.addEventListener('done', event => {
				const data = JSON.parse(event.data)
				console.log('Simulação finalizada:', data)
				isSimulating.value = false
				eventSource.close()
				currentEventSource.value = null
			})

			eventSource.onerror = error => {
				console.error('Erro no EventSource:', error)
				isSimulating.value = false
				eventSource.close()
				currentEventSource.value = null
			}
		} catch (error) {
			isSimulating.value = false
			throw error
		}
	}

	//Função para cancelar simulação
	const cancelSimulation = () => {
		if (currentEventSource.value) {
			currentEventSource.value.close()
			currentEventSource.value = null
		}
		isSimulating.value = false
	}

	//Função para verificar se simulation-bot está disponível
	const checkSimulationBotHealth = async (): Promise<boolean> => {
		try {
			const response = (await $fetch('http://localhost:3001/health')) as { status: string }
			return response.status === 'healthy'
		} catch (error) {
			console.error('Simulation bot não está disponível:', error)
			return false
		}
	}

	//Computed para resultados bem-sucedidos
	const successfulResults = computed(() => results.value.filter(r => r.status === 'ok' && r.result))

	//Computed para erros
	const errorResults = computed(() => results.value.filter(r => r.status !== 'ok'))

	//Computed para melhor oferta
	const bestOffer = computed(() => {
		const successful = successfulResults.value
		if (!successful.length) return null

		let best = successful[0]
		if (!best?.result?.parcelas?.[0]) return best

		for (const result of successful) {
			const currentValue = result.result?.parcelas?.[0]?.valor
			const bestValue = best.result?.parcelas?.[0]?.valor

			if (currentValue && bestValue && currentValue < bestValue) {
				best = result
			}
		}
		return best
	})

	//Limpar ao desmontar
	onUnmounted(() => {
		cancelSimulation()
	})

	return {
		isSimulating: readonly(isSimulating),
		results: readonly(results),
		successfulResults,
		errorResults,
		bestOffer,
		startSimulation,
		cancelSimulation,
		checkSimulationBotHealth
	}
}
