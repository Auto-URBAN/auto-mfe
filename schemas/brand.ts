import { z } from 'zod'

export const Brand = z.object({
	name: z.number(),
	id: z.string()
})

export type Brand = z.infer<typeof Brand>
export const BrandList = z.array(Brand)
export type BrandList = z.infer<typeof BrandList>
