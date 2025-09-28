export default defineEventHandler(async (event) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Mock users data
    const mockUsers = [
      {
        id: 'usr001',
        phone: '11987654321',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-09-01T10:30:00Z',
        ads: {
          total: 3,
          byStatus: {
            approved: 2,
            pending: 1,
            rejected: 0
          }
        }
      },
      {
        id: 'usr002',
        phone: '21987654321',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-09-05T14:15:00Z',
        ads: {
          total: 1,
          byStatus: {
            approved: 0,
            pending: 1,
            rejected: 0
          }
        }
      },
      {
        id: 'usr003',
        phone: '31987654321',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-08-20T09:45:00Z',
        ads: {
          total: 5,
          byStatus: {
            approved: 4,
            pending: 0,
            rejected: 1
          }
        }
      },
      {
        id: 'adm001',
        phone: '11999888777',
        role: 'ADMIN' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-08-01T08:00:00Z',
        ads: {
          total: 0,
          byStatus: {
            approved: 0,
            pending: 0,
            rejected: 0
          }
        }
      },
      {
        id: 'usr004',
        phone: '61987654321',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-09-10T16:20:00Z',
        ads: {
          total: 2,
          byStatus: {
            approved: 1,
            pending: 0,
            rejected: 1
          }
        }
      },
      {
        id: 'usr005',
        phone: '71987654321',
        role: 'USER' as const,
        status: 'ACTIVE' as const,
        createdAt: '2025-09-15T11:30:00Z',
        ads: {
          total: 1,
          byStatus: {
            approved: 0,
            pending: 1,
            rejected: 0
          }
        }
      },
      {
        id: 'usr006',
        phone: '85987654321',
        role: 'USER' as const,
        status: 'SUSPENDED' as const,
        createdAt: '2025-08-25T13:45:00Z',
        ads: {
          total: 0,
          byStatus: {
            approved: 0,
            pending: 0,
            rejected: 0
          }
        }
      }
    ]

    return mockUsers
  } catch (error) {
    console.error('Error in /api/admin/users:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})