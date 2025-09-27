export default defineEventHandler(async (event) => {
  try {
    const vehicleId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!vehicleId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Vehicle ID is required'
      })
    }

    if (!body?.reason || body.reason.trim().length < 10) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Rejection reason is required (minimum 10 characters)'
      })
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // In a real app, this would update the database
    console.log(`Rejecting vehicle ${vehicleId} with reason: ${body.reason}`)

    return {
      success: true,
      message: 'Vehicle rejected successfully',
      vehicleId,
      status: 'REJECTED',
      moderatedAt: new Date().toISOString(),
      rejectionReason: body.reason.trim()
    }
  } catch (error: any) {
    console.error('Error rejecting vehicle:', error)
    
    if (error?.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to reject vehicle'
    })
  }
})