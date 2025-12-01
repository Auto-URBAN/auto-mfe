export default defineEventHandler(async event => {
	try {
		const vehicleId = getRouterParam(event, 'id')

		if (!vehicleId) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Vehicle ID is required'
			})
		}

		await new Promise(resolve => setTimeout(resolve, 600))

		const mockVehicles: Record<string, any> = {
			'honda-civic-type-r-2021': {
				id: 'honda-civic-type-r-2021',
				title: 'Honda Civic Type R 2021',
				brand: 'Honda',
				model: 'Civic Type R',
				year: 2021,
				price: 350000,
				km: 25000,
				horsepower: 310,
				slug: 'honda-civic-type-r-2021',
				city: 'São Paulo',
				uf: 'SP' as const,
				status: 'APPROVED' as const,
				featured: true,
				coverImageUrl:
					'https://hips.hearstapps.com/hmg-prod/images/103-2020-honda-civic-type-r-140-1590038142.jpg?crop=0.637xw:0.538xh;0.0684xw,0.438xh&resize=2048:*'
			},
			'toyota-corolla-2022': {
				id: 'toyota-corolla-2022',
				title: 'Toyota Corolla XEi 2022',
				brand: 'Toyota',
				model: 'Corolla XEi',
				year: 2022,
				price: 125000,
				km: 15000,
				horsepower: 154,
				slug: 'toyota-corolla-2022',
				city: 'Rio de Janeiro',
				uf: 'RJ' as const,
				status: 'APPROVED' as const,
				featured: false,
				coverImageUrl:
					'https://www.toyota.com.br/content/dam/toyota/brazil/vehicles/corolla/2022/corolla-xei-2022-galeria-01.jpg'
			}
		}

		const mockVehicle = mockVehicles[vehicleId] || {
			id: vehicleId,
			title: 'Veículo Exemplo',
			brand: 'Marca',
			model: 'Modelo',
			year: 2021,
			price: 100000,
			km: 25000,
			horsepower: 120,
			slug: vehicleId,
			city: 'São Paulo',
			uf: 'SP' as const,
			status: 'APPROVED' as const,
			featured: false,
			coverImageUrl: 'https://via.placeholder.com/640x360/374151/ffffff?text=Veículo'
		}

		if (vehicleId === 'invalid') {
			throw createError({
				statusCode: 404,
				statusMessage: 'Vehicle not found'
			})
		}

		mockVehicle.images = [
			mockVehicle.coverImageUrl,
			'https://via.placeholder.com/640x360/374151/ffffff?text=Imagem+2',
			'https://via.placeholder.com/640x360/374151/ffffff?text=Imagem+3'
		]
		mockVehicle.description = `${mockVehicle.title} em excelente estado de conservação.

🔥 CARACTERÍSTICAS:
• Motor de alta performance
• Ar condicionado digital
• Central multimídia com Android Auto/Apple CarPlay
• Rodas de liga leve
• Sensor de estacionamento
• Partida por botão

🛡️ SEGURANÇA:
• Freios ABS com EBD
• Controle de estabilidade e tração
• Airbags frontais, laterais e de cortina

📋 HISTÓRICO:
• Único dono
• Manual e chave reserva
• Revisões em concessionária
• IPVA 2025 pago
• Licenciamento em dia`

		mockVehicle.gearbox = 'AUTO'
		mockVehicle.fuel = 'GASOLINA'
		mockVehicle.color = 'Branco Perolizado'
		mockVehicle.fipeCode = `${mockVehicle.id.replace(/-/g, '')}-001`
		mockVehicle.createdAt = '2025-09-20T14:30:00Z'
		mockVehicle.seller = {
			id: 'seller_001',
			phone: '11987654321',
			whatsapp: '5511987654321'
		}

		return mockVehicle
	} catch (error: any) {
		console.error('Error fetching vehicle details:', error)

		if (error?.statusCode) {
			throw error
		}

		throw createError({
			statusCode: 500,
			statusMessage: 'Internal Server Error'
		})
	}
})
