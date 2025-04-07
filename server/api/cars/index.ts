import type { Car } from '@/schemas/car'
export default defineEventHandler(async (event): Promise<Car> => {
    const api = useRuntimeConfig().apiUrl
    const slug = getQuery(event).slug
    try{
        if(!slug) throw createError({
            statusCode: 400,
            statusMessage: 'Bad Request',
            message: 'Slug is required'
        })
        return await $fetch<Car>(`${api}/cars/by-slug/${slug}`)
    } catch (error) {
        console.error('Error fetching car data:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to fetch car data'
        })
    }
})