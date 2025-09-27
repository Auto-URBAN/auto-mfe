import { AdminMetrics } from '~/schemas/admin'

export default defineEventHandler(async (event) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock metrics data
    const mockMetrics = {
      totals: {
        vehicles: 45,
        approved: 32,
        pending: 8,
        rejected: 5,
        users: 123
      },
      byBrand: [
        { brand: 'Honda', count: 12 },
        { brand: 'Toyota', count: 10 },
        { brand: 'Volkswagen', count: 8 },
        { brand: 'Hyundai', count: 6 },
        { brand: 'Chevrolet', count: 5 },
        { brand: 'Ford', count: 4 }
      ],
      byUF: [
        { uf: 'SP', count: 15 },
        { uf: 'RJ', count: 8 },
        { uf: 'MG', count: 7 },
        { uf: 'RS', count: 5 },
        { uf: 'PR', count: 4 },
        { uf: 'BA', count: 3 },
        { uf: 'SC', count: 3 }
      ]
    }

    // Validate response
    const validatedMetrics = AdminMetrics.parse(mockMetrics)
    
    return validatedMetrics
  } catch (error) {
    console.error('Error in /api/admin/metrics:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})