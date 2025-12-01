import { z } from 'zod'

export const UserWishlist = z.object({
	id: z.union([z.string(), z.number()]).transform(val => String(val)),
	carModelSlug: z.string(),
	brand: z.string(),
	model: z.string(),
	targetPriceMin: z.number().optional(),
	targetPriceMax: z.number().optional(),
	notificationsEnabled: z.boolean().default(true),
	photo: z.string().nullable().optional(),
	yearMin: z.number().optional(),
	yearMax: z.number().optional(),
	createdAt: z
		.union([z.string(), z.date()])
		.transform(val => (typeof val === 'string' ? new Date(val) : val))
})

export const UserWishlistRequest = z
	.object({
		carModelSlug: z.string().min(1, 'Slug do modelo é obrigatório'),
		brand: z.string().min(1, 'Marca é obrigatória'),
		model: z.string().min(1, 'Modelo é obrigatório'),
		targetPriceMin: z.number().positive('Preço mínimo deve ser positivo').optional(),
		targetPriceMax: z.number().positive('Preço máximo deve ser positivo').optional(),
		notificationsEnabled: z.boolean().default(true),
		photo: z.string().url('URL da foto inválida').optional(),
		yearMin: z.number().min(1900, 'Ano mínimo inválido').optional(),
		yearMax: z
			.number()
			.max(new Date().getFullYear() + 1, 'Ano máximo inválido')
			.optional()
	})
	.refine(
		data => {
			if (data.targetPriceMin && data.targetPriceMax) {
				return data.targetPriceMin <= data.targetPriceMax
			}
			return true
		},
		{
			message: 'Preço mínimo deve ser menor ou igual ao preço máximo',
			path: ['targetPriceMax']
		}
	)
	.refine(
		data => {
			if (data.yearMin && data.yearMax) {
				return data.yearMin <= data.yearMax
			}
			return true
		},
		{
			message: 'Ano mínimo deve ser menor ou igual ao ano máximo',
			path: ['yearMax']
		}
	)

export type UserWishlist = z.infer<typeof UserWishlist>
export type UserWishlistRequest = z.infer<typeof UserWishlistRequest>
