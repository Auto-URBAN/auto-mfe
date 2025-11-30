import type { User } from '~/schemas'

interface AuthResponse {
	token: string
	refreshToken: string
	user: {
		id: number
		firstName?: string
		lastName?: string
		phone: string
		email?: string
		phoneVerified?: boolean
		roles?: string[]
	}
	expiresAt: string
}

export const useAuthSimple = () => {
	const config = useRuntimeConfig()
	const user = ref<User | null>(null)
	const accessToken = useCookie('auth-token', { maxAge: 60 * 60 * 24 * 7 })
	const refreshToken = useCookie('refresh-token', { maxAge: 60 * 60 * 24 * 30 })
	const userCookie = useCookie<User | null>('user-data', {
		maxAge: 60 * 60 * 24 * 7,
		default: () => null
	})

	// Inicializar estado do usuário a partir dos cookies
	if (accessToken.value && userCookie.value) {
		user.value = userCookie.value
	}

	const isLoggedIn = computed(() => !!accessToken.value && !!user.value)

	const sendOtp = async (phone: string, firstName?: string): Promise<void> => {
		await $fetch(`${config.public.apiBase}/auth/send-otp`, {
			method: 'POST',
			body: { phone, firstName }
		})
	}

	const transformUser = (apiUser: AuthResponse['user']): User => {
		return {
			id: String(apiUser.id),
			firstName: apiUser.firstName,
			lastName: apiUser.lastName,
			phone: apiUser.phone,
			email: apiUser.email,
			phoneVerified: apiUser.phoneVerified,
			roles: apiUser.roles as ('USER' | 'ADMIN')[],
			role: (apiUser.roles?.[0] as 'USER' | 'ADMIN') || 'USER'
		}
	}

	const verifyOtp = async (phone: string, code: string): Promise<void> => {
		const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/verify-otp`, {
			method: 'POST',
			body: { phone, code }
		})

		const transformedUser = transformUser(response.user)
		user.value = transformedUser
		userCookie.value = transformedUser
		accessToken.value = response.token
		refreshToken.value = response.refreshToken
	}

	const logout = async (): Promise<void> => {
		user.value = null
		userCookie.value = null
		accessToken.value = null
		refreshToken.value = null
		await navigateTo('/auth/login')
	}

	const refreshTokens = async (): Promise<void> => {
		if (!refreshToken.value) return

		const response = await $fetch<AuthResponse>(`${config.public.apiBase}/auth/refresh`, {
			method: 'POST',
			body: { refreshToken: refreshToken.value }
		})

		const transformedUser = transformUser(response.user)
		accessToken.value = response.token
		refreshToken.value = response.refreshToken
		user.value = transformedUser
		userCookie.value = transformedUser
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
