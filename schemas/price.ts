import { z } from 'zod';

export const Price = z.object({
    id: z.number(),
    carId: z.number(),
    referenceDate: z.string(),
    value: z.number(),
});
export type Price = z.infer<typeof Price>;
export const PriceList = z.array(Price);
export type PriceList = z.infer<typeof PriceList>;