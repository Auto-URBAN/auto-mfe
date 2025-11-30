export interface FinancingTip {
	id: string
	emoji: string
	title: string
	description: string
}

export default defineEventHandler((): FinancingTip[] => {
	return [
		{
			id: 'entrada',
			emoji: '💰',
			title: 'Dê a maior entrada possível',
			description:
				'Quanto mais você paga na entrada, menos juros vai pagar no total. Tente dar pelo menos 30% do valor.'
		},
		{
			id: 'prazo',
			emoji: '📅',
			title: 'Escolha o prazo certo',
			description:
				'Prazos longos = parcelas menores, mas muito mais juros. Equilibre com o que cabe no seu bolso.'
		},
		{
			id: 'compare',
			emoji: '🔍',
			title: 'Compare as taxas',
			description:
				'Não aceite a primeira proposta. Consulte pelo menos 3 bancos diferentes antes de fechar.'
		},
		{
			id: 'contrato',
			emoji: '⚡',
			title: 'Leia o contrato todo',
			description:
				'Preste atenção em seguro obrigatório, TAC, IOF e outras taxas. Tudo isso aumenta o custo final.'
		}
	]
})
