import { z } from 'zod'

export const RankingItemSchema = z.object({
	id: z.string().min(1),
	modelo: z.string().min(1),
	brand: z.string().min(1),
	variacao: z.string(),
	preco: z.number().positive(),
	imagem: z.string().url(),
	year: z
		.number()
		.int()
		.min(1900)
		.max(new Date().getFullYear() + 1),
	km: z.number().int().min(0),
	horsepower: z.number().int().min(0),
	uf: z.string().length(2)
})

export type RankingItem = z.infer<typeof RankingItemSchema>
