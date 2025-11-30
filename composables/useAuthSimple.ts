import type { User } from '~/schemas'

interface AuthResponse {
	token: string
	refreshToken: string
	user: User
	expiresAt: string
}

export const useAuthSimple = () => {
	const config = useRuntimeConfig()
	const user = ref<User | null>(null)
	const accessToken = useCookie('auth-token', { maxAge: 60 * 60 * 24 * 7 })
	const refreshToken = useCookie('refresh-token', { maxAge: 60 * 60 * 24 * 30 })
	const isLoggedIn = computed(() => !!accessToken.value)

	const sendOtp = async (phone: string, firstName?: string): Promise<void> => {
		if (config.public.useMockData) {
			await new Promise(resolve => setTimeout(resolve, 500))
			console.log(`Mock OTP sent to ${phone}: 1234`)
			return
		}

		await $fetch(`${config.public.apiBase}/auth/send-otp`, {
			method: 'POST',
			body: { phone, firstName }
		})
	}

	const verifyOtp = async (phone: string, code: string): Promise<void> => {
		if (config.public.useMockData) {
			await new Promise(resolve => setTimeout(resolve, 1000))

			user.value = {
				id: '1',
				phone: phone,
				role: 'USER'
			}

			accessToken.value = 'mock-jwt-token'
			return
		}

		const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/verify-otp`, {
			method: 'POST',
			body: { phone, code }
		})

		user.value = response.user
		accessToken.value = response.token
		refreshToken.value = response.refreshToken
	}

	const logout = async (): Promise<void> => {
		user.value = null
		accessToken.value = null
		refreshToken.value = null
		await navigateTo('/auth/login')
	}

	const refreshTokens = async (): Promise<void> => {
		if (config.public.useMockData || !refreshToken.value) return

		const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/refresh`, {
			method: 'POST',
			body: { refreshToken: refreshToken.value }
		})

		accessToken.value = response.token
		refreshToken.value = response.refreshToken
		user.value = response.user
	}

	return {
		user: readonly(user),
		isLoggedIn,
		accessToken: readonly(accessToken),
		sendOtp,
		verifyOtp,
		logout,
		refreshTokens
	}
}
