export default defineEventHandler(async event => {
	try {
		const vehicleId = getRouterParam(event, 'id')

		if (!vehicleId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Vehicle ID is required'
			})
		}

		await new Promise(resolve => setTimeout(resolve, 400))

		const mockRelatedVehicles = [
			{
				id: 'rel_001',
				title: 'Honda Civic 2.0 EXL 2020',
				brand: 'Honda',
				model: 'Civic',
				year: 2020,
				price: 82000,
				km: 35000,
				city: 'Rio de Janeiro',
				uf: 'RJ' as const,
				coverImageUrl:
					'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2020/202012/20201215/honda-civic-2.0-16v-flexone-exl-cvt-wmimagem11234567890.jpg',
				status: 'APPROVED' as const,
				createdAt: new Date().toISOString()
			},
			{
				id: 'rel_002',
				title: 'Honda Civic 1.5 VTEC TURBO 2022',
				brand: 'Honda',
				model: 'Civic',
				year: 2022,
				price: 95000,
				km: 15000,
				city: 'Belo Horizonte',
				uf: 'MG' as const,
				coverImageUrl:
					'https://revistacarro.com.br/wp-content/uploads/2022/03/Honda-Civic-2022-1.jpg',
				status: 'APPROVED' as const,
				createdAt: new Date().toISOString()
			},
			{
				id: 'rel_003',
				title: 'Toyota Corolla 2.0 XEI 2021',
				brand: 'Toyota',
				model: 'Corolla',
				year: 2021,
				price: 87000,
				km: 28000,
				city: 'São Paulo',
				uf: 'SP' as const,
				coverImageUrl:
					'https://cdn.autopapo.com.br/box/uploads/2020/08/11180013/novo-toyota-corolla-2021-01-732x488.jpg',
				status: 'APPROVED' as const,
				createdAt: new Date().toISOString()
			}
		]

		const relatedVehicles = mockRelatedVehicles.filter(vehicle => vehicle.id !== vehicleId)

		return relatedVehicles
	} catch (error: any) {
		console.error('Error fetching related vehicles:', error)

		if (error?.statusCode) {
			throw error
		}

		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error'
		})
	}
})
