export default defineEventHandler(async event => {
	try {
		const body = await readBody(event)
		const { phone, code } = body

		if (!phone || !code) {
			throw createError({
				statusCode: 400,
				statusMessage: 'Phone and code are required'
			})
		}

		await new Promise(resolve => setTimeout(resolve, 800))

		if (code === '123456') {
			const mockUser = {
				id: `user_${phone}`,
				phone,
				role: 'USER' as const,
				createdAt: new Date().toISOString()
			}

			const accessToken = `mock_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
			const refreshToken = `mock_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

			return {
				success: true,
				accessToken,
				refreshToken,
				user: mockUser,
				message: 'Login successful'
			}
		} else if (code === '654321') {
			const mockAdminUser = {
				id: `admin_${phone}`,
				phone,
				role: 'ADMIN' as const,
				createdAt: new Date().toISOString()
			}

			const accessToken = `mock_admin_access_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
			const refreshToken = `mock_admin_refresh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

			return {
				success: true,
				accessToken,
				refreshToken,
				user: mockAdminUser,
				message: 'Admin login successful'
			}
		} else if (code === '000000') {
			throw createError({
				statusCode: 401,
				statusMessage: 'Invalid OTP code'
			})
		} else {
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
