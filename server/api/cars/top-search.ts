import type { CarList } from '@/schemas/car'
export default defineEventHandler(async (event): Promise<CarList> => {
    const api = useRuntimeConfig().apiUrl
    return await $fetch<CarList>(`${api}/cars/top-search`)
})