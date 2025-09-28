export default defineEventHandler(async (event) => {
  try {
    const vehicleId = getRouterParam(event, 'id')
    
    if (!vehicleId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vehicle ID is required'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600))

    // Mock vehicle details - in a real app this would come from database
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
      coverImageUrl: 'https://cdn.motor1.com/images/mgl/Oo376A/s3/honda-civic-type-r---brasil.jpg',
      images: [
        'https://cdn.motor1.com/images/mgl/Oo376A/s3/honda-civic-type-r---brasil.jpg',
        'https://garagem360.com.br/wp-content/uploads/2023/06/unnamed-3.jpg',
        'https://www.honda.com/content/dam/site/honda/vehicles/civic/type-r/2021/overview/exterior/2021-honda-civic-type-r-side-profile.jpg'
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

    // Validate vehicle exists (in a real app)
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