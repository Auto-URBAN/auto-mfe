export interface FinancingBank {
	id: string
	name: string
	rate: number
	note?: string
	logo?: string
	minEntry?: number
	maxTerm?: number
}

export default defineEventHandler((): FinancingBank[] => {
	//TODO: Futuramente buscar de uma API real ou banco de dados
	return [
		{
			id: 'bb',
			name: 'Banco do Brasil',
			rate: 1.49,
			note: 'Taxa promocional para veículos até 5 anos',
			minEntry: 20,
			maxTerm: 60
		},
		{
			id: 'bradesco',
			name: 'Bradesco',
			rate: 1.55,
			note: 'Condições especiais para clientes Prime',
			minEntry: 20,
			maxTerm: 60
		},
		{
			id: 'itau',
			name: 'Itaú',
			rate: 1.59,
			note: 'Análise de crédito facilitada',
			minEntry: 20,
			maxTerm: 60
		},
		{
			id: 'santander',
			name: 'Santander',
			rate: 1.69,
			note: 'Liberação rápida do crédito',
			minEntry: 20,
			maxTerm: 60
		},
		{
			id: 'caixa',
			name: 'Caixa Econômica',
			rate: 1.45,
			note: 'Menor taxa para servidores públicos',
			minEntry: 20,
			maxTerm: 60
		},
		{
			id: 'safra',
			name: 'Banco Safra',
			rate: 1.39,
			note: 'Taxa especial para veículos seminovos',
			minEntry: 30,
			maxTerm: 48
		},
		{
			id: 'bv',
			name: 'BV Financeira',
			rate: 1.79,
			note: 'Aprovação mesmo com restrição',
			minEntry: 30,
			maxTerm: 60
		},
		{
			id: 'pan',
			name: 'Banco Pan',
			rate: 1.89,
			note: 'Financiamento para autônomos',
			minEntry: 30,
			maxTerm: 60
		},
		{
			id: 'consorcio',
			name: 'Consórcio',
			rate: 0,
			note: 'Sem juros, apenas taxa administrativa',
			minEntry: 0,
			maxTerm: 80
		}
	]
})
