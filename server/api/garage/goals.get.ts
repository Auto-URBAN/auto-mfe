import type { GarageGoal } from '@/schemas/garage'

export default defineEventHandler(async (event): Promise<GarageGoal[]> => {
	const config = useRuntimeConfig()
	const query = getQuery(event)
	const userId = query.userId || '1' // Default user for testing

	try {
		// Call the new unified backend API
		const response = await $fetch(`${config.apiUrl}/api/v1/user-vehicles/objectives`, {
			query: { userId }
		})

		// Transform from new UserVehicleRelation to old GarageGoal format
		const goals: GarageGoal[] = response.map((relation: any) => ({
			id: relation.id.toString(),
			carModelSlug: relation.carModel.slug,
			brand: relation.carModel.brand,
			model: relation.carModel.model,
			targetPriceMin: relation.targetPriceMin,
			targetPriceMax: relation.targetPriceMax,
			notificationsEnabled: relation.notificationsEnabled || true,
			photo: relation.carModel.coverImageUrl,
			yearMin: relation.carModel.year,
			yearMax: relation.carModel.year,
			createdAt: new Date(relation.createdAt)
		}))

		return goals
	} catch (error) {
		console.error('Error fetching objectives:', error)
		// Fallback to empty array in case of error
		return []
	}
})
