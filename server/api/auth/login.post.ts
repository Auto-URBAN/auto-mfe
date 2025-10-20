export default defineEventHandler(async event => {
	try {
		const body = await readBody(event)
		const { phone } = body

		if (!phone || phone.length < 10) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Phone number is required and must be valid'
			})
		}

		await new Promise(resolve => setTimeout(resolve, 1000))

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
