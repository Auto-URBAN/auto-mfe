import type { VehicleStatus } from '~/schemas/vehicle'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const status = query.status as string | undefined
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Mock vehicles for moderation
    const mockVehicles = [
      {
        id: 'vh001',
        title: 'Honda Civic 2021',
        brand: 'Honda',
        model: 'Civic',
        year: 2021,
        price: 89000,
        km: 25000,
        city: 'São Paulo',
        uf: 'SP',
        coverImageUrl: '/imgs/cars/honda-civic.jpg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-25T10:30:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr001',
          phone: '11987654321',
          whatsapp: '5511987654321'
        }
      },
      {
        id: 'vh002', 
        title: 'Toyota Corolla 2020',
        brand: 'Toyota',
        model: 'Corolla',
        year: 2020,
        price: 82000,
        km: 35000,
        city: 'Rio de Janeiro',
        uf: 'RJ',
        coverImageUrl: '/imgs/cars/toyota-corolla.jpg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-24T15:45:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr002',
          phone: '21987654321',
          whatsapp: '5521987654321'
        }
      },
      {
        id: 'vh003',
        title: 'VW Jetta 2019',
        brand: 'Volkswagen',
        model: 'Jetta',
        year: 2019,
        price: 75000,
        km: 45000,
        city: 'Belo Horizonte',
        uf: 'MG',
        coverImageUrl: '/imgs/cars/vw-jetta.jpg',
        status: 'APPROVED' as VehicleStatus,
        createdAt: '2025-09-23T09:15:00Z',
        moderatedAt: '2025-09-23T16:30:00Z',
        rejectionReason: null,
        seller: {
          id: 'usr003',
          phone: '31987654321',
          whatsapp: '5531987654321'
        }
      },
      {
        id: 'vh004',
        title: 'Ford Ka 2018',
        brand: 'Ford',
        model: 'Ka',
        year: 2018,
        price: 35000,
        km: 60000,
        city: 'Brasília',
        uf: 'DF',
        coverImageUrl: '/imgs/cars/ford-ka.jpg',
        status: 'REJECTED' as VehicleStatus,
        createdAt: '2025-09-22T14:20:00Z',
        moderatedAt: '2025-09-22T18:45:00Z',
        rejectionReason: 'Imagens de baixa qualidade e descrição incompleta',
        seller: {
          id: 'usr004',
          phone: '61987654321',
          whatsapp: '5561987654321'
        }
      },
      {
        id: 'vh005',
        title: 'Hyundai HB20 2022',
        brand: 'Hyundai',
        model: 'HB20',
        year: 2022,
        price: 68000,
        km: 15000,
        city: 'Salvador',
        uf: 'BA',
        coverImageUrl: '/imgs/cars/hyundai-hb20.jpg',
        status: 'PENDING' as VehicleStatus,
        createdAt: '2025-09-26T11:10:00Z',
        moderatedAt: null,
        rejectionReason: null,
        seller: {
          id: 'usr005',
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