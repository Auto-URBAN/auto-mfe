import { z } from 'zod';
import { Brand } from './brand';
import { Price } from './price';
import { Partner } from './partner';

export const Car = z.object({
    id: z.number(),
    name: z.string(),
    model: z.string(),
    branch: Brand,
    modelYear: z.number(),
    fipeCode: z.string(),
    thumb: z.string(),
    averageValue: z.number(),
    minValue: z.number(),
    maxValue: z.number(),
    slug: z.string(),
    prices: z.array(Price),
    partners: z.array(Partner)
});
export type Car = z.infer<typeof Car>;

export const CarList = z.array(Car);
export type CarList = z.infer<typeof CarList>;