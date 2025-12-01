import brandsData from '~/server/data/brands.json'

export default defineEventHandler(async () => {
	const config = useRuntimeConfig()

	try {
		// Use the new CarModel backend API
		const brands = await $fetch(`${config.apiUrl}/api/v1/car-models/brands`)

		// Transform to the expected format with counts and models
		const brandsWithCounts = brands.map((brand: string) => ({
			id: brand.toLowerCase().replace(/\s+/g, '-'),
			name: brand,
			logo: `/logos/${brand.toLowerCase().replace(/\s+/g, '-')}.webp`,
			models: [], // TODO: get models for each brand
			count: 0 // TODO: get count for each brand
		}))

		return brandsWithCounts
	} catch (error) {
		console.error('Error fetching brands:', error)

		// Fallback to mock data
		await mockDelay(100)
		return brandsData
	}
})
