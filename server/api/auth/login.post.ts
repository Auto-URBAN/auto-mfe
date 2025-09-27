export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { phone } = body
    
    if (!phone || phone.length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Phone number is required and must be valid'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // In a real app, this would:
    // 1. Check if user exists
    // 2. Send OTP via SMS/WhatsApp
    // 3. Store OTP in database with expiration
    
    console.log(`Mock OTP sent to ${phone}: 123456`)
    
    return {
      success: true,
      otpSent: true,
      phone,
      message: 'OTP sent successfully'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    if (error?.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})