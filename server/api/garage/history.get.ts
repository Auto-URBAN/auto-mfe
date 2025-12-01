import type { GarageHistoryCar } from '@/schemas/garage'

export default defineEventHandler(async (event): Promise<GarageHistoryCar[]> => {
	const config = useRuntimeConfig()
	const query = getQuery(event)
	const userId = query.userId || '1' // Default user for testing

	try {
		// Call the new unified backend API
		const response = await $fetch(`${config.apiUrl}/api/v1/user-vehicles/history`, {
			query: { userId }
		})

		// Transform from new UserVehicleRelation to old GarageHistoryCar format
		const historyCars: GarageHistoryCar[] = response.map((relation: any) => ({
			id: relation.id.toString(),
			carModelSlug: relation.carModel.slug,
			brand: relation.carModel.brand,
			model: relation.carModel.model,
			year: relation.carModel.year,
			purchaseDate: new Date(relation.purchaseDate || Date.now()),
			soldDate: relation.sellDate ? new Date(relation.sellDate) : undefined,
			purchasePrice: relation.purchasePrice || 0,
			soldPrice: relation.sellPrice,
			km: relation.odometer || 0,
			mods: (relation.modifications || []).map((mod: any) => ({
				type: mod.categoryType,
				description: mod.description,
				date: mod.installationDate ? new Date(mod.installationDate) : undefined
			})),
			soldReason: relation.exitReason,
			notes: relation.notes,
			photos: relation.photoUrls || [],
			color: relation.color,
			profitLoss: relation.profitLoss,
			isActive: false
		}))

		return historyCars
	} catch (error) {
		console.error('Error fetching history:', error)
		// Fallback to empty array in case of error
		return []
	}
})
