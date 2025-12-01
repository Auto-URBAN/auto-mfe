import { z } from 'zod'

export const FavoriteAdvertisement = z.object({
	id: z.string(),
	advertisementId: z.string(),
	userId: z.string(),
	createdAt: z.date()
})

export const FavoriteRequest = z.object({
	advertisementId: z.string().min(1, 'ID do anúncio é obrigatório')
})

export type FavoriteAdvertisement = z.infer<typeof FavoriteAdvertisement>
export type FavoriteRequest = z.infer<typeof FavoriteRequest>
