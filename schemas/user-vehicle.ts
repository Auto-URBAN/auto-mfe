import { z } from 'zod'

export const RelationType = z.enum(['OBJECTIVE', 'OWNED', 'HISTORY'])
export const SaleStatus = z.enum(['FOR_SALE', 'SOLD'])

export const VehicleModificationSchema = z.object({
	id: z.number().optional(),
	categoryType: z.string(),
	modificationType: z.string(),
	description: z.string(),
	cost: z.number().optional(),
	installationDate: z.string().optional()
})

export const CarModelSummarySchema = z.object({
	id: z.number(),
	slug: z.string(),
	brand: z.string(),
	model: z.string(),
	variant: z.string().optional(),
	year: z.number(),
	coverImageUrl: z.string().optional(),
	basePrice: z.number().optional()
})

export const UserVehicleRelationSchema = z.object({
	id: z.number().optional(),
	relationType: RelationType,
	saleStatus: SaleStatus.optional(),

	carModel: CarModelSummarySchema,

	targetPriceMin: z.number().optional(),
	targetPriceMax: z.number().optional(),
	purchasePrice: z.number().optional(),
	sellPrice: z.number().optional(),
	askingPrice: z.number().optional(),

	color: z.string().optional(),
	odometer: z.number().optional(),
	licensePlate: z.string().optional(),
	plateVerified: z.boolean().optional(),
	city: z.string().optional(),
	uf: z.string().optional(),

	purchaseDate: z.string().optional(),
	sellDate: z.string().optional(),
	listedForSaleAt: z.string().optional(),

	notificationsEnabled: z.boolean().optional(),
	notes: z.string().optional(),
	saleDescription: z.string().optional(),
	exitReason: z.string().optional(),

	modifications: z.array(VehicleModificationSchema).optional(),
	photoUrls: z.array(z.string()).optional(),

	createdAt: z.string().optional(),
	updatedAt: z.string().optional(),

	profitLoss: z.number().optional(),
	ownershipDays: z.number().optional()
})

export const AddToObjectivesRequestSchema = z.object({
	userId: z.number(),
	carModelId: z.number(),
	minPrice: z.number().optional(),
	maxPrice: z.number().optional(),
	notes: z.string().optional(),
	enableNotifications: z.boolean().optional()
})

export const PurchaseVehicleRequestSchema = z.object({
	purchasePrice: z.number(),
	purchaseDate: z.string(),
	color: z.string().optional(),
	odometer: z.number().optional(),
	licensePlate: z.string().optional(),
	city: z.string().optional(),
	uf: z.string().optional()
})

export const SellVehicleRequestSchema = z.object({
	sellPrice: z.number(),
	sellDate: z.string(),
	exitReason: z.string().optional()
})

export const ListForSaleRequestSchema = z.object({
	askingPrice: z.number(),
	saleDescription: z.string().optional(),
	photoUrls: z.array(z.string()).optional()
})

export const UserVehicleStatsSchema = z.object({
	objectivesCount: z.number(),
	ownedCount: z.number(),
	historyCount: z.number(),
	totalInvestment: z.number()
})

export const SearchResponseSchema = z.object({
	content: z.array(UserVehicleRelationSchema),
	page: z.object({
		size: z.number(),
		number: z.number(),
		totalElements: z.number(),
		totalPages: z.number()
	})
})
export type RelationType = z.infer<typeof RelationType>
export type SaleStatus = z.infer<typeof SaleStatus>
export type VehicleModification = z.infer<typeof VehicleModificationSchema>
export type CarModelSummary = z.infer<typeof CarModelSummarySchema>
export type UserVehicleRelation = z.infer<typeof UserVehicleRelationSchema>
export type AddToObjectivesRequest = z.infer<typeof AddToObjectivesRequestSchema>
export type PurchaseVehicleRequest = z.infer<typeof PurchaseVehicleRequestSchema>
export type SellVehicleRequest = z.infer<typeof SellVehicleRequestSchema>
export type ListForSaleRequest = z.infer<typeof ListForSaleRequestSchema>
export type UserVehicleStats = z.infer<typeof UserVehicleStatsSchema>
export type SearchResponse = z.infer<typeof SearchResponseSchema>

export const GarageGoal = UserVehicleRelationSchema.extend({
	relationType: z.literal('OBJECTIVE')
}).transform(data => ({
	id: data.id?.toString() || '',
	carModelSlug: data.carModel.slug,
	brand: data.carModel.brand,
	model: data.carModel.model,
	targetPriceMin: data.targetPriceMin,
	targetPriceMax: data.targetPriceMax,
	notificationsEnabled: data.notificationsEnabled || true,
	photo: data.carModel.coverImageUrl,
	createdAt: new Date(data.createdAt || Date.now())
}))

export const GarageCurrentCar = UserVehicleRelationSchema.extend({
	relationType: z.literal('OWNED')
}).transform(data => ({
	id: data.id?.toString() || '',
	carModelSlug: data.carModel.slug,
	brand: data.carModel.brand,
	model: data.carModel.model,
	year: data.carModel.year,
	color: data.color || '',
	km: data.odometer || 0,
	fipeValue: data.carModel.basePrice || 0,
	variation12m: 0,
	plateVerified: data.plateVerified || false,
	mods: (data.modifications || []).map(mod => ({
		type: mod.categoryType,
		description: mod.description,
		date: mod.installationDate ? new Date(mod.installationDate) : undefined
	})),
	photos: data.photoUrls || [],
	lastUpdate: data.updatedAt ? new Date(data.updatedAt) : undefined,
	purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
	purchasePrice: data.purchasePrice,
	notes: data.notes,
	isActive: true
}))

export const GarageHistoryCar = UserVehicleRelationSchema.extend({
	relationType: z.literal('HISTORY')
}).transform(data => ({
	id: data.id?.toString() || '',
	carModelSlug: data.carModel.slug,
	brand: data.carModel.brand,
	model: data.carModel.model,
	year: data.carModel.year,
	purchaseDate: new Date(data.purchaseDate || Date.now()),
	soldDate: data.sellDate ? new Date(data.sellDate) : undefined,
	purchasePrice: data.purchasePrice || 0,
	soldPrice: data.sellPrice,
	km: data.odometer || 0,
	mods: (data.modifications || []).map(mod => ({
		type: mod.categoryType,
		description: mod.description,
		date: mod.installationDate ? new Date(mod.installationDate) : undefined
	})),
	soldReason: data.exitReason,
	notes: data.notes,
	photos: data.photoUrls || [],
	color: data.color,
	profitLoss: data.profitLoss,
	isActive: false
}))

export type GarageGoal = z.infer<typeof GarageGoal>
export type GarageCurrentCar = z.infer<typeof GarageCurrentCar>
export type GarageHistoryCar = z.infer<typeof GarageHistoryCar>
