import { z } from 'zod'

export const Partner = z.object({
	name: z.string(),
	value: z.number()
})

export type Partner = z.infer<typeof Partner>
export const PartnerList = z.array(Partner)
export type PartnerList = z.infer<typeof PartnerList>
