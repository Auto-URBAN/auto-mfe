import type { SearchResult, VehicleDetail } from '~/schemas/vehicle'
import vehiclesData from '~/server/data/vehicles.json'

export default defineEventHandler(async (event): Promise<SearchResult | VehicleDetail> => {
	const config = useRuntimeConfig()

	try {
		// Use the new CarModel backend API
		const query = getQuery(event)
		const slug = query.slug as string | undefined

		if (slug) {
			// Get single vehicle by slug
			const vehicle = await $fetch(`${config.apiUrl}/api/v1/car-models/slug/${slug}`)

			if (!vehicle) {
				throw createError({
					statusCode: 404,
					statusMessage: 'Vehicle not found'
				})
			}

			// Transform CarModelDTO to VehicleDetail
			const vehicleDetail: VehicleDetail = {
				id: vehicle.slug,
				title: `${vehicle.brand} ${vehicle.model} ${vehicle.variant || ''}`,
				brand: vehicle.brand,
				model: vehicle.model,
				year: vehicle.year,
				price: vehicle.basePrice || 0,
				km: 0, // CarModel doesn't have km, this would come from marketplace listings
				horsepower: vehicle.horsepower || 0,
				city: 'N/A', // CarModel is generic, location comes from listings
				uf: 'N/A',
				coverImageUrl: vehicle.coverImageUrl || '',
				status: 'APPROVED',
				featured: false, // TODO: implement featured logic
				slug: vehicle.slug,
				fipeCode: vehicle.fipeCode || '',
				description: vehicle.description || '',
				gearbox: vehicle.gearbox || 'MANUAL',
				fuel: vehicle.fuelType || 'GASOLINA',
				color: 'N/A', // Generic model, color comes from individual listings
				images: vehicle.imageUrls || [],
				averageValue: vehicle.basePrice || 0,
				minValue: vehicle.basePrice ? Math.floor(vehicle.basePrice * 0.9) : 0,
				maxValue: vehicle.basePrice ? Math.ceil(vehicle.basePrice * 1.1) : 0,
				prices: [], // TODO: get from CarModelPriceHistory
				partners: [], // TODO: implement if needed
				seller: null,
				createdAt: vehicle.createdAt || new Date().toISOString()
			}

			return vehicleDetail
		}

		// Search vehicles with filters
		const page = parseInt((query.page as string) || '1') - 1 // Backend uses 0-based pages
		const pageSize = parseInt((query.pageSize as string) || '20')
		const featured = query.featured === 'true'

		let apiQuery: any = {
			page,
			size: pageSize
		}

		// Apply filters
		if (query.q) apiQuery.query = query.q
		if (query.brand) apiQuery.brand = query.brand
		if (query.model) apiQuery.model = query.model
		if (query.priceMin) apiQuery.minPrice = query.priceMin
		if (query.priceMax) apiQuery.maxPrice = query.priceMax
		if (query.yearMin || query.yearMax) {
			// For year filtering, we'll need to implement range support in backend
			if (query.yearMin) apiQuery.yearMin = query.yearMin
			if (query.yearMax) apiQuery.yearMax = query.yearMax
		}

		const endpoint = featured ? '/api/v1/car-models/popular' : '/api/v1/car-models'
		const response = await $fetch(`${config.apiUrl}${endpoint}`, { query: apiQuery })

		// Transform Spring Page response to our SearchResult format
		const searchResult: SearchResult = {
			items: response.content.map((carModel: any) => ({
				id: carModel.slug,
				title: `${carModel.brand} ${carModel.model} ${carModel.variant || ''}`,
				brand: carModel.brand,
				model: carModel.model,
				year: carModel.year,
				price: carModel.basePrice || 0,
				km: 0, // Generic model
				horsepower: carModel.horsepower || 0,
				city: 'N/A',
				uf: 'N/A',
				coverImageUrl: carModel.coverImageUrl || '',
				status: 'APPROVED',
				featured: false,
				slug: carModel.slug,
				fipeCode: carModel.fipeCode || '',
				description: carModel.description || '',
				gearbox: carModel.gearbox || 'MANUAL',
				fuel: carModel.fuelType || 'GASOLINA',
				color: 'N/A',
				images: carModel.imageUrls || [],
				averageValue: carModel.basePrice || 0,
				minValue: carModel.basePrice ? Math.floor(carModel.basePrice * 0.9) : 0,
				maxValue: carModel.basePrice ? Math.ceil(carModel.basePrice * 1.1) : 0,
				prices: [],
				partners: [],
				seller: null,
				createdAt: carModel.createdAt || new Date().toISOString()
			})),
			page: response.page.number + 1, // Convert back to 1-based
			pageSize: response.page.size,
			total: response.page.totalElements
		}

		return searchResult
	} catch (error) {
		console.error('Error fetching vehicles:', error)

		// Fallback to mock data in case of error
		await mockDelay(300)

		const query = getQuery(event)

		const slug = query.slug as string | undefined
		const page = parseInt((query.page as string) || '1')
		const pageSize = parseInt((query.pageSize as string) || '20')
		const featured = query.featured === 'true'
		const ranking = query.ranking as 'valorizados' | 'depreciados' | undefined

		const allVehicles = vehiclesData as any as VehicleDetail[]

		if (slug) {
			const vehicle = allVehicles.find(v => v.slug === slug)
			if (!vehicle) {
				throw createError({
					statusCode: 404,
					statusMessage: 'Vehicle not found'
				})
			}
			return vehicle
		}

		let filteredVehicles = [...allVehicles]

		if (featured) {
			filteredVehicles = filteredVehicles.filter(v => v.featured === true)
		}

		if (query.q) {
			const searchTerm = (query.q as string).toLowerCase()
			filteredVehicles = filteredVehicles.filter(
				v =>
					v.title.toLowerCase().includes(searchTerm) ||
					v.brand.toLowerCase().includes(searchTerm) ||
					v.model.toLowerCase().includes(searchTerm)
			)
		}

		if (query.brand) {
			filteredVehicles = filteredVehicles.filter(
				v => v.brand.toLowerCase() === (query.brand as string).toLowerCase()
			)
		}

		if (query.model) {
			filteredVehicles = filteredVehicles.filter(v =>
				v.model.toLowerCase().includes((query.model as string).toLowerCase())
			)
		}

		if (query.uf) {
			filteredVehicles = filteredVehicles.filter(v => v.uf === query.uf)
		}

		if (query.priceMin) {
			const priceMin = parseInt(query.priceMin as string)
			filteredVehicles = filteredVehicles.filter(v => v.price >= priceMin)
		}

		if (query.priceMax) {
			const priceMax = parseInt(query.priceMax as string)
			filteredVehicles = filteredVehicles.filter(v => v.price <= priceMax)
		}

		if (query.yearMin) {
			const yearMin = parseInt(query.yearMin as string)
			filteredVehicles = filteredVehicles.filter(v => v.year >= yearMin)
		}

		if (query.yearMax) {
			const yearMax = parseInt(query.yearMax as string)
			filteredVehicles = filteredVehicles.filter(v => v.year <= yearMax)
		}

		if (query.kmMax) {
			const kmMax = parseInt(query.kmMax as string)
			filteredVehicles = filteredVehicles.filter(v => v.km <= kmMax)
		}

		const sort = (query.sort as string) || 'recent'
		switch (sort) {
			case 'price_asc':
				filteredVehicles.sort((a, b) => a.price - b.price)
				break
			case 'price_desc':
				filteredVehicles.sort((a, b) => b.price - a.price)
				break
			case 'year_desc':
				filteredVehicles.sort((a, b) => b.year - a.year)
				break
			case 'km_asc':
				filteredVehicles.sort((a, b) => a.km - b.km)
				break
			case 'recent':
			default:
				filteredVehicles.sort(
					(a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
				)
				break
		}

		if (ranking === 'valorizados') {
			filteredVehicles = filteredVehicles
				.filter(v => v.prices && v.prices.length > 0)
				.sort((a, b) => {
					const aPrices = a.prices || []
					const bPrices = b.prices || []
					const aGrowth =
						aPrices.length > 1
							? (aPrices[aPrices.length - 1].value - aPrices[0].value) / aPrices[0].value
							: 0
					const bGrowth =
						bPrices.length > 1
							? (bPrices[bPrices.length - 1].value - bPrices[0].value) / bPrices[0].value
							: 0
					return bGrowth - aGrowth
				})
				.slice(0, pageSize)
		}

		if (ranking === 'depreciados') {
			filteredVehicles = filteredVehicles
				.filter(v => v.prices && v.prices.length > 0)
				.sort((a, b) => {
					const aPrices = a.prices || []
					const bPrices = b.prices || []
					const aGrowth =
						aPrices.length > 1
							? (aPrices[aPrices.length - 1].value - aPrices[0].value) / aPrices[0].value
							: 0
					const bGrowth =
						bPrices.length > 1
							? (bPrices[bPrices.length - 1].value - bPrices[0].value) / bPrices[0].value
							: 0
					return aGrowth - bGrowth
				})
				.slice(0, pageSize)
		}

		const start = (page - 1) * pageSize
		const end = start + pageSize
		const paginatedVehicles = filteredVehicles.slice(start, end)

		await new Promise(resolve => setTimeout(resolve, 150))

		return {
			items: paginatedVehicles,
			page,
			pageSize,
			total: filteredVehicles.length
		}
	}
})
