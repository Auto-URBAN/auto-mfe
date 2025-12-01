import type { GarageCurrentCar } from '@/schemas/garage'

export default defineEventHandler(async (event): Promise<GarageCurrentCar[]> => {
	const config = useRuntimeConfig()
	const query = getQuery(event)
	const userId = query.userId || '1' // Default user for testing

	try {
		// Call the new unified backend API
		const response = await $fetch(`${config.apiUrl}/api/v1/user-vehicles/garage`, {
			query: { userId }
		})

		// Transform from new UserVehicleRelation to old GarageCurrentCar format
		const currentCars: GarageCurrentCar[] = response.map((relation: any) => ({
			id: relation.id.toString(),
			carModelSlug: relation.carModel.slug,
			brand: relation.carModel.brand,
			model: relation.carModel.model,
			year: relation.carModel.year,
			color: relation.color || '',
			km: relation.odometer || 0,
			fipeValue: relation.carModel.basePrice || 0,
			variation12m: 0, // TODO: calculate based on price history
			plateVerified: relation.plateVerified || false,
			mods: (relation.modifications || []).map((mod: any) => ({
				type: mod.categoryType,
				description: mod.description,
				date: mod.installationDate ? new Date(mod.installationDate) : undefined
			})),
			photos: relation.photoUrls || [],
			lastUpdate: relation.updatedAt ? new Date(relation.updatedAt) : undefined,
			purchaseDate: relation.purchaseDate ? new Date(relation.purchaseDate) : undefined,
			purchasePrice: relation.purchasePrice,
			notes: relation.notes,
			isActive: true
		}))

		return currentCars
	} catch (error) {
		console.error('Error fetching garage:', error)
		// Fallback to empty array in case of error
		return []
	}
})
