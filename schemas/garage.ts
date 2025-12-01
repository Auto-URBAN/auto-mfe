import { z } from 'zod'

export const CarMod = z.object({
	type: z.string(),
	description: z.string(),
	date: z.date().optional()
})

export const GarageCurrentCar = z.object({
	id: z.string(),
	carModelSlug: z.string().optional(),
	brand: z.string(),
	model: z.string(),
	year: z.number(),
	color: z.string(),
	km: z.number(),
	fipeValue: z.number(),
	variation12m: z.number(),
	plateVerified: z.boolean().default(false),
	mods: z.array(CarMod).default([]),
	photos: z.array(z.string()).default([]),
	lastUpdate: z.date().optional(),
	purchaseDate: z.date().optional(),
	purchasePrice: z.number().optional(),
	notes: z.string().optional(),
	isActive: z.boolean().default(true)
})

export const CarHistoryStatus = z.enum(['SOLD', 'CRASHED', 'STOLEN', 'DONATED', 'TOTALED'])

export const GarageHistoryCar = z.object({
	id: z.string(),
	carModelSlug: z.string().optional(),
	brand: z.string(),
	model: z.string(),
	year: z.number(),
	purchaseDate: z.date(),
	soldDate: z.date().optional(),
	purchasePrice: z.number(),
	soldPrice: z.number().optional(),
	km: z.number(),
	mods: z.array(CarMod).default([]),
	soldReason: z.string().optional(),
	notes: z.string().optional(),
	photos: z.array(z.string()).default([]),
	color: z.string().optional(),
	profitLoss: z.number().optional(),
	isActive: z.boolean().default(false)
})

// Substituído por UserWishlist no schema wishlist.ts
// Mantido apenas para compatibilidade temporária
export const GarageGoal = z.object({
	id: z.string(),
	carModelSlug: z.string(),
	brand: z.string(),
	model: z.string(),
	targetPriceMin: z.number().optional(),
	targetPriceMax: z.number().optional(),
	notificationsEnabled: z.boolean().default(true),
	photo: z.string().optional(),
	yearMin: z.number().optional(),
	yearMax: z.number().optional(),
	createdAt: z.date()
})

export const NotificationType = z.enum([
	'APPRECIATION',
	'DEPRECIATION',
	'NEW_AD',
	'PRICE_ALERT',
	'GOAL_MATCH',
	'INSIGHT'
])

export const GarageNotification = z.object({
	id: z.string(),
	type: NotificationType,
	message: z.string(),
	carModelSlug: z.string().optional(),
	carId: z.string().optional(),
	createdAt: z.date(),
	read: z.boolean().default(false),
	metadata: z.record(z.any()).optional()
})

export const GarageSegmentBreakdown = z.object({
	type: z.string(),
	count: z.number(),
	percentage: z.number()
})

export const GarageBrandVariation = z.object({
	brand: z.string(),
	avgVariation: z.number(),
	count: z.number()
})

export const GarageValueHistory = z.object({
	month: z.string(),
	value: z.number()
})

export const GarageInsight = z.object({
	title: z.string(),
	value: z.string(),
	description: z.string().optional(),
	type: z.enum(['positive', 'negative', 'neutral']).default('neutral')
})

export const GarageStats = z.object({
	totalCars: z.number(),
	totalCurrentValue: z.number(),
	avgVariation: z.number(),
	totalHistoricalCars: z.number(),
	totalGoals: z.number(),
	valueHistory: z.array(GarageValueHistory),
	segmentBreakdown: z.array(GarageSegmentBreakdown),
	brandVariation: z.array(GarageBrandVariation),
	insights: z.array(GarageInsight)
})

export const MoveCarPayload = z.object({
	carId: z.string(),
	from: z.enum(['current', 'history']),
	to: z.enum(['current', 'history']),
	additionalData: z.record(z.any()).optional()
})

export type CarMod = z.infer<typeof CarMod>
export type GarageCurrentCar = z.infer<typeof GarageCurrentCar>
export type CarHistoryStatus = z.infer<typeof CarHistoryStatus>
export type GarageHistoryCar = z.infer<typeof GarageHistoryCar>
export type GarageGoal = z.infer<typeof GarageGoal>
export type NotificationType = z.infer<typeof NotificationType>
export type GarageNotification = z.infer<typeof GarageNotification>
export type GarageSegmentBreakdown = z.infer<typeof GarageSegmentBreakdown>
export type GarageBrandVariation = z.infer<typeof GarageBrandVariation>
export type GarageValueHistory = z.infer<typeof GarageValueHistory>
export type GarageInsight = z.infer<typeof GarageInsight>
export type GarageStats = z.infer<typeof GarageStats>
export type MoveCarPayload = z.infer<typeof MoveCarPayload>
