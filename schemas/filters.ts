import { z } from 'zod'

// Schema para marca com dados relacionais
export const BrandSchema = z.object({
	id: z.string(),
	name: z.string(),
	logo: z.string(), // webp files
	models: z.array(z.string()),
	years: z.array(z.number()),
	count: z.number()
})

// Schema para cor com hex e contador
export const ColorSchema = z.object({
	id: z.string(),
	name: z.string(),
	hex: z.string().regex(/^#[0-9A-F]{6}$/i),
	count: z.number()
})

// Schema para modelo com anos disponíveis
export const ModelSchema = z.object({
	id: z.string(),
	name: z.string(),
	brandId: z.string(),
	years: z.array(z.number()),
	count: z.number()
})

// Schema para estado
export const StateSchema = z.object({
	id: z.string(),
	name: z.string(),
	uf: z.string(),
	count: z.number()
})

// Schema para faixa de preço/km
export const RangeSchema = z.object({
	min: z.number().optional(),
	max: z.number().optional()
})

// Schema principal dos filtros V2
export const FiltersV2Schema = z.object({
	brands: z.array(z.string()).default([]),
	models: z.array(z.string()).default([]),
	years: z.array(z.number()).default([]),
	colors: z.array(z.string()).default([]),
	states: z.array(z.string()).default([]),
	priceRange: RangeSchema.optional(),
	kmRange: RangeSchema.optional(),
	sort: z.string().default('recent')
})

// Schema da resposta da API de filtros
export const FiltersOptionsV2Schema = z.object({
	brands: z.array(BrandSchema),
	models: z.array(ModelSchema),
	colors: z.array(ColorSchema),
	states: z.array(StateSchema),
	years: z.array(z.number()),
	sortOptions: z.array(
		z.object({
			value: z.string(),
			label: z.string()
		})
	),
	priceRanges: z.array(
		z.object({
			value: z.string(),
			label: z.string(),
			min: z.number(),
			max: z.number()
		})
	),
	kmRanges: z.array(
		z.object({
			value: z.string(),
			label: z.string(),
			min: z.number(),
			max: z.number()
		})
	)
})

// Tipos TypeScript inferidos
export type Brand = z.infer<typeof BrandSchema>
export type Color = z.infer<typeof ColorSchema>
export type Model = z.infer<typeof ModelSchema>
export type State = z.infer<typeof StateSchema>
export type Range = z.infer<typeof RangeSchema>
export type FiltersV2 = z.infer<typeof FiltersV2Schema>
export type FiltersOptionsV2 = z.infer<typeof FiltersOptionsV2Schema>
