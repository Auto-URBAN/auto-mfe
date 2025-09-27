export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { phone, code } = body
    
    if (!phone || !code) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Phone and code are required'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Mock OTP verification
    // In a real app, this would verify against stored OTP
    if (code === '123456') {
      // Success case
      const mockUser = {
        id: `user_${phone}`,
        phone,
        role: 'USER' as const,
        createdAt: new Date().toISOString()
      }
      
      // Generate mock JWT tokens
      const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      return {
        success: true,
        accessToken,
        refreshToken,
        user: mockUser,
        message: 'Login successful'
      }
    } else if (code === '000000') {
      // Error case for testing
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid OTP code'
      })
    } else {
      // Invalid code
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid OTP code'
      })
    }
  } catch (error: any) {
    console.error('OTP verification error:', error)
    
    if (error?.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})