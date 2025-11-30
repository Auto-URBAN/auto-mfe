export interface FinancingType {
	id: string
	title: string
	description: string
	icon: string
	iconBg: string
	iconColor: string
	pros: string[]
	cons: string[]
}

export default defineEventHandler((): FinancingType[] => {
	return [
		{
			id: 'cdc',
			title: 'CDC',
			description:
				'Crédito Direto ao Consumidor. O mais comum no Brasil. Você financia direto com o banco e o carro fica alienado até quitar.',
			icon: 'heroicons:currency-dollar',
			iconBg: 'bg-blue-100',
			iconColor: 'text-blue-600',
			pros: ['Liberação rápida', 'Pode quitar antecipado'],
			cons: ['Juros mais altos']
		},
		{
			id: 'leasing',
			title: 'Leasing',
			description:
				'Arrendamento mercantil. Você "aluga" o carro com opção de compra no final. Popular para PJ.',
			icon: 'heroicons:document-text',
			iconBg: 'bg-purple-100',
			iconColor: 'text-purple-600',
			pros: ['Vantagens fiscais (PJ)', 'Taxas menores'],
			cons: ['Menos flexível']
		},
		{
			id: 'consorcio',
			title: 'Consórcio',
			description:
				'Grupos de pessoas que se juntam para comprar. Sem juros, mas depende de sorteio ou lance.',
			icon: 'heroicons:user-group',
			iconBg: 'bg-amber-100',
			iconColor: 'text-amber-600',
			pros: ['Sem juros', 'Melhor custo total'],
			cons: ['Precisa esperar contemplação']
		}
	]
})
