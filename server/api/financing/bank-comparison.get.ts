export interface BankComparison {
	id: string
	name: string
	emoji: string
	color: string
	rateMonthly: number
	rateYearly: number
	maxTerm: number
	observation: string
	highlight?: boolean
}

export default defineEventHandler((): BankComparison[] => {
	return [
		{
			id: 'bb',
			name: 'Banco do Brasil',
			emoji: '🟡',
			color: 'yellow',
			rateMonthly: 1.49,
			rateYearly: 19.56,
			maxTerm: 60,
			observation: 'Para correntistas'
		},
		{
			id: 'bradesco',
			name: 'Bradesco',
			emoji: '🔴',
			color: 'red',
			rateMonthly: 1.55,
			rateYearly: 20.33,
			maxTerm: 60,
			observation: 'Para clientes Prime'
		},
		{
			id: 'itau',
			name: 'Itaú',
			emoji: '🟠',
			color: 'orange',
			rateMonthly: 1.59,
			rateYearly: 20.89,
			maxTerm: 60,
			observation: 'Análise de crédito'
		},
		{
			id: 'santander',
			name: 'Santander',
			emoji: '🔴',
			color: 'red',
			rateMonthly: 1.69,
			rateYearly: 22.28,
			maxTerm: 60,
			observation: 'Liberação rápida'
		},
		{
			id: 'caixa',
			name: 'Caixa Econômica',
			emoji: '🔵',
			color: 'blue',
			rateMonthly: 1.45,
			rateYearly: 18.92,
			maxTerm: 60,
			observation: 'Para servidores públicos'
		},
		{
			id: 'safra',
			name: 'Banco Safra',
			emoji: '🟢',
			color: 'green',
			rateMonthly: 1.39,
			rateYearly: 18.03,
			maxTerm: 48,
			observation: 'Veículos seminovos'
		},
		{
			id: 'consorcio',
			name: 'Consórcio',
			emoji: '👥',
			color: 'green',
			rateMonthly: 0,
			rateYearly: 0,
			maxTerm: 100,
			observation: 'Taxa administrativa ~10%',
			highlight: true
		}
	]
})
