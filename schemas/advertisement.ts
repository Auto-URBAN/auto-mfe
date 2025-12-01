import { z } from 'zod'

export const Advertisement = z.object({
	id: z.string(),
	carModelSlug: z.string(),
	title: z.string(),
	price: z.number(),
	description: z.string().optional(),
	location: z.string().optional(),
	brand: z.string(),
	model: z.string(),
	year: z.number().optional(),
	color: z.string().optional(),
	km: z.number().optional(),
	photos: z.array(z.string()).default([]),
	sellerName: z.string().optional(),
	sellerPhone: z.string().optional(),
	sellerEmail: z.string().optional(),
	active: z.boolean().default(true),
	createdAt: z.date()
})

export const AdvertisementRequest = z.object({
	carModelSlug: z.string(),
	title: z.string().min(1, 'Título é obrigatório'),
	price: z.number().positive('Preço deve ser maior que zero'),
	description: z.string().optional(),
	location: z.string().optional(),
	brand: z.string().min(1, 'Marca é obrigatória'),
	model: z.string().min(1, 'Modelo é obrigatório'),
	year: z.number().optional(),
	color: z.string().optional(),
	km: z.number().min(0, 'Quilometragem deve ser positiva').optional(),
	photos: z.array(z.string()).default([]),
	sellerName: z.string().optional(),
	sellerPhone: z.string().optional(),
	sellerEmail: z.string().email('Email inválido').optional(),
	active: z.boolean().default(true)
})

export const AdvertisementFilters = z.object({
	brand: z.string().optional(),
	model: z.string().optional(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	minYear: z.number().optional(),
	maxYear: z.number().optional()
})

export type Advertisement = z.infer<typeof Advertisement>
export type AdvertisementRequest = z.infer<typeof AdvertisementRequest>
export type AdvertisementFilters = z.infer<typeof AdvertisementFilters>
