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

		const mockVehicle = {
			id: vehicleId,
			title: 'Honda Civic Type R 2021',
			brand: 'Honda',
			model: 'Civic',
			year: 2021,
			price: 350000,
			km: 25000,
			city: 'São Paulo',
			uf: 'SP' as const,
			status: 'APPROVED' as const,
			coverImageUrl:
				'https://hips.hearstapps.com/hmg-prod/images/103-2020-honda-civic-type-r-140-1590038142.jpg?crop=0.637xw:0.538xh;0.0684xw,0.438xh&resize=2048:*',
			images: [
				'https://hips.hearstapps.com/hmg-prod/images/103-2020-honda-civic-type-r-140-1590038142.jpg?crop=0.637xw:0.538xh;0.0684xw,0.438xh&resize=2048:*',
				'https://cdn.motor1.com/images/mgl/zOOE9A/s3/2017-honda-civic-type-r.jpg',
				'https://media.ed.edmunds-media.com/honda/civic-type-r/2017/oem/2017_honda_civic-type-r_hatchback_touring_fq_oem_3_1600.jpg'
			],
			description: `Honda Civic Sport 1.5 Turbo 2021 em excelente estado de conservação.

🔥 CARACTERÍSTICAS:
• Motor 1.5 VTEC Turbo - 174cv
• Transmissão CVT
• Ar condicionado digital
• Central multimídia com Android Auto/Apple CarPlay
• Rodas de liga leve 17"
• Banco do motorista com regulagem elétrica
• Sensor de estacionamento traseiro
• Partida por botão

🛡️ SEGURANÇA:
• Honda SENSING (pacote de segurança)
• Freios ABS com EBD
• Controle de estabilidade e tração
• Airbags frontais, laterais e de cortina

📋 HISTÓRICO:
• Único dono
• Manual e chave reserva
• Revisões em concessionária
• IPVA 2025 pago
• Licenciamento em dia

Carro impecável, sem sinistro, pronto para rodar. Aceito financiamento e consórcio.`,
			gearbox: 'AUTO' as const,
			fuel: 'GASOLINA' as const,
			color: 'Branco Perolizado',
			createdAt: '2025-09-20T14:30:00Z',
			seller: {
				id: 'seller_001',
				phone: '11987654321',
				whatsapp: '5511987654321'
			}
		}

		if (vehicleId === 'invalid') {
			throw createError({
				statusCode: 404,
				statusMessage: 'Vehicle not found'
			})
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
