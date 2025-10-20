import { z } from 'zod'

export const Bank = z.object({
	id: z.number(),
	name: z.string()
})

export type Bank = z.infer<typeof Bank>
export const BankList = z.array(Bank)
export type BankList = z.infer<typeof BankList>

export const BankWithTax = z.object({
	bankId: z.number(),
	bankName: z.string(),
	taxMonth: z.number(),
	taxYear: z.number(),
	date: z.string().transform(date => new Date(date))
})

export type BankWithTax = z.infer<typeof BankWithTax>
export const BankWithTaxList = z.array(BankWithTax)
export type BankWithTaxList = z.infer<typeof BankWithTaxList>
