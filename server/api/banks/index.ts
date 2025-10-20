import type { BankList } from '@/schemas/bank'
export default defineEventHandler(async (event): Promise<BankList> => {
	const api = useRuntimeConfig().apiUrl
	return await $fetch<BankList>(`${api}/bank`)
})
