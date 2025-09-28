import type { VehicleStatus } from '~/schemas/vehicle'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = query.status as string | undefined
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock vehicles for moderation - Premium sports cars and high-end vehicles
    const mockVehicles = [
      {
        id: 'vh001',
        title: 'Porsche 911 Turbo Cabriolet 2023',
        brand: 'Porsche',
        model: '911',
        year: 2023,
        price: 1449000,
        km: 1725,
        city: 'Campo Grande',
        uf: 'MS',
        coverImageUrl: 'https://s3.sa-east-1.amazonaws.com/revista.mobiauto/Porsche/911+Turbo+S/Porsche-911-Turbo-S-Traseira.jpg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-25T10:30:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr001',
          phone: '67987654321',
          whatsapp: '5567987654321'
        }
      },
      {
        id: 'vh002', 
        title: 'BMW M3 Competition 2022',
        brand: 'BMW',
        model: 'M3',
        year: 2022,
        price: 685000,
        km: 8500,
        city: 'São Paulo',
        uf: 'SP',
        coverImageUrl: 'https://s3.ecompletocarros.dev/images/lojas/108/veiculos/206897/veiculoInfoVeiculoImagesMobile/vehicle_image_1724358685_d41d8cd98f00b204e9800998ecf8427e.jpeg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-24T15:45:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr002',
          phone: '11987654321',
          whatsapp: '5511987654321'
        }
      },
      {
        id: 'vh003',
        title: 'VW Golf GTI Performance 2024',
        brand: 'Volkswagen',
        model: 'Golf GTI',
        year: 2024,
        price: 185000,
        km: 3200,
        city: 'Porto Alegre',
        uf: 'RS',
        coverImageUrl: 'https://revistacarro.com.br/wp-content/uploads/2024/09/Golf4-1173x768.jpg',
        status: 'APPROVED' as VehicleStatus,
        createdAt: '2025-09-23T09:15:00Z',
        moderatedAt: '2025-09-23T16:30:00Z',
        rejectionReason: null,
        seller: {
          id: 'usr003',
          phone: '51987654321',
          whatsapp: '5551987654321'
        }
      },
      {
        id: 'vh004',
        title: 'Nissan GT-R Premium 2020',
        brand: 'Nissan',
        model: 'GT-R',
        year: 2020,
        price: 950000,
        km: 12500,
        city: 'Rio de Janeiro',
        uf: 'RJ',
        coverImageUrl: 'https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202509/20250921/nissan-gtr-3-8-premium-v6-24v-biturbo-gasolina-2p-automatico-wmimagem23532117213.webp',
        status: 'REJECTED' as VehicleStatus,
        createdAt: '2025-09-22T14:20:00Z',
        moderatedAt: '2025-09-22T18:45:00Z',
        rejectionReason: 'Documentação irregular e histórico de sinistros não declarado',
        seller: {
          id: 'usr004',
          phone: '21987654321',
          whatsapp: '5521987654321'
        }
      },
      {
        id: 'vh005',
        title: 'VW Polo GTS 2023',
        brand: 'Volkswagen',
        model: 'Polo GTS',
        year: 2023,
        price: 98500,
        km: 5800,
        city: 'Curitiba',
        uf: 'PR',
        coverImageUrl: 'https://cdn.motor1.com/images/mgl/jl9zy6/s3/vw-polo-gts-250tsi-2024.jpg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-26T11:10:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr005',
          phone: '41987654321',
          whatsapp: '5541987654321'
        }
      },
      {
        id: 'vh006',
        title: 'BMW M2 Competition 2021',
        brand: 'BMW',
        model: 'M2',
        year: 2021,
        price: 525000,
        km: 15000,
        city: 'Belo Horizonte',
        uf: 'MG',
        coverImageUrl: 'https://i.ytimg.com/vi/7AqMTC0C_XQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDmGdWf9iTnO5E0Vpjpg5pP30hK1w',
        status: 'APPROVED' as VehicleStatus,
        createdAt: '2025-09-21T13:25:00Z',
        moderatedAt: '2025-09-21T17:40:00Z',
        rejectionReason: null,
        seller: {
          id: 'usr006',
          phone: '31987654321',
          whatsapp: '5531987654321'
        }
      },
      {
        id: 'vh007',
        title: 'Renault Sandero RS 2.0 2021',
        brand: 'Renault',
        model: 'Sandero RS',
        year: 2021,
        price: 85000,
        km: 22000,
        city: 'Brasília',
        uf: 'DF',
        coverImageUrl: 'https://s3.ecompletocarros.dev/images/lojas/558/veiculos/218494/veiculoInfoVeiculoImagesMobile/vehicle_image_1735271875_d41d8cd98f00b204e9800998ecf8427e.jpeg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-27T08:15:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr007',
          phone: '61987654321',
          whatsapp: '5561987654321'
        }
      },
      {
        id: 'vh008',
        title: 'Mercedes-AMG C63 S 2019',
        brand: 'Mercedes-Benz',
        model: 'AMG C63 S',
        year: 2019,
        price: 450000,
        km: 28500,
        city: 'Salvador',
        uf: 'BA',
        coverImageUrl: 'https://editorial.pxcrush.net/carsales/general/editorial/2019-mercedes-c63-sandown-034.jpg?width=1024&height=682',
        status: 'APPROVED' as VehicleStatus,
        createdAt: '2025-09-20T16:45:00Z',
        moderatedAt: '2025-09-20T19:30:00Z',
        rejectionReason: null,
        seller: {
          id: 'usr008',
          phone: '71987654321',
          whatsapp: '5571987654321'
        }
      }
    ]

    // Filter by status if provided
    let filteredVehicles = mockVehicles
    if (status && status !== 'all' && ['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
      filteredVehicles = mockVehicles.filter(vehicle => vehicle.status === status)
    }

    return filteredVehicles
  } catch (error) {
    console.error('Error in /api/admin/vehicles:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})