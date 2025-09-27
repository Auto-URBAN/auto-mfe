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
    await new Promise(resolve => setTimeout(resolve, 400))

    // Mock related vehicles - in a real app this would be based on brand, model, price range, location, etc.
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
        coverImageUrl: '/imgs/search-latest-example.jpg',
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
        coverImageUrl: '/imgs/search-example.jpg',
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
        coverImageUrl: '/imgs/background.jpg',
        status: 'APPROVED' as const,
        createdAt: new Date().toISOString()
      }
    ]

    // Filter out the current vehicle if it appears in related
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