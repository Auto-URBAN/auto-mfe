import { z } from 'zod';
export const Installment = z.object({
    valueInitial: z.number(),
    valueTotal: z.number(),
    qtdMonths: z.number(),
    taxMonth: z.number(),
    taxFixed: z.number(),
});
export type Installment = z.infer<typeof Installment>;

export const InstallmentResolved = z.object({
    installment: z.number(),
    totalPaid: z.number(),
    totalInterest: z.number(),
    financedValue: z.number(),
});
export type InstallmentResolved = z.infer<typeof InstallmentResolved>;