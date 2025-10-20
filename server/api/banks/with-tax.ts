import type { BankWithTaxList } from '@/schemas/bank'
export default defineEventHandler(async (event): Promise<BankWithTaxList> => {
	const api = useRuntimeConfig().apiUrl
	return await $fetch<BankWithTaxList>(`${api}/bank-taxes`)
})
