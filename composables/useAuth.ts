import {
	User,
	AuthState,
	RegisterRequest,
	LoginRequest,
	VerifyOTPRequest,
	VerifyOTPResponse
} from '~/schemas'
import { z } from 'zod'

const AdminStatsSchema = z.object({
	totals: z.object({
		vehicles: z.number(),
		pending: z.number(),
		approved: z.number(),
		rejected: z.number().optional(),
		users: z.number()
	}),
	byBrand: z
		.array(
			z.object({
				brand: z.string(),
				count: z.number()
			})
		)
		.optional(),
	byUF: z
		.array(
			z.object({
				uf: z.string(),
				count: z.number()
			})
		)
		.optional()
})

const AdminUserSchema = z.object({
	id: z.string(),
	phone: z.string(),
	role: z.enum(['USER', 'ADMIN']),
	status: z.enum(['ACTIVE', 'SUSPENDED']),
	createdAt: z.string().optional(),
	lastLogin: z.string().optional(),
	ads: z
		.object({
			total: z.number(),
			byStatus: z.object({
				approved: z.number(),
				pending: z.number(),
				rejected: z.number()
			})
		})
		.optional()
})

const AdminVehicleSchema = z.object({
	id: z.string(),
	title: z.string(),
	status: z.enum(['APPROVED', 'PENDING', 'REJECTED']),
	userId: z.string(),
	createdAt: z.string().optional(),
	price: z.number()
})

const AuthStateSchema = z.object({
	user: User.nullable(),
	accessToken: z.string().nullable(),
	refreshToken: z.string().nullable(),
	isAuthenticated: z.boolean(),
	loading: z.boolean()
})

type AuthStateType = z.infer<typeof AuthStateSchema>

const authState = reactive<AuthStateType>({
	user: null,
	accessToken: null,
	refreshToken: null,
	isAuthenticated: false,
	loading: false
})

const adminState = reactive({
	stats: null as z.infer<typeof AdminStatsSchema> | null,
	users: [] as z.infer<typeof AdminUserSchema>[],
	vehicles: [] as z.infer<typeof AdminVehicleSchema>[],
	loading: false,
	error: null as string | null
})

export const useAuth = () => {
	const user = toRef(authState, 'user')
	const accessToken = toRef(authState, 'accessToken')
	const refreshToken = toRef(authState, 'refreshToken')
	const isAuthenticated = toRef(authState, 'isAuthenticated')
	const loading = toRef(authState, 'loading')

	const isAdmin = computed(() => user.value?.role === 'ADMIN')
	const currentUser = computed(() => user.value)
	const userName = computed((): string => {
		if (user.value?.phone) return user.value.phone
		return 'Usuário'
	})
	const userInitials = computed((): string => {
		if (user.value?.phone) {
			const phoneDigits = user.value.phone.replace(/\D/g, '')
			return phoneDigits.slice(-2).toUpperCase()
		}
		return 'U'
	})

	const register = async (phone: string) => {
		authState.loading = true
		try {
			const validatedData = RegisterRequest.parse({ phone })

			const PhoneSchema = z
				.string()
				.min(10)
				.max(15)
				.regex(/^[+]?[1-9][\d]{0,15}$/)
			PhoneSchema.parse(phone)

			const response = await $fetch('/api/auth/register', {
				method: 'POST',
				body: validatedData
			})

			return response
		} catch (error) {
			console.error('Registration error:', error)
			throw error
		} finally {
			authState.loading = false
		}
	}

	const login = async (phone: string) => {
		authState.loading = true
		try {
			const validatedData = LoginRequest.parse({ phone })

			const PhoneSchema = z
				.string()
				.min(10)
				.max(15)
				.regex(/^[+]?[1-9][\d]{0,15}$/)
			PhoneSchema.parse(phone)

			const response = await $fetch('/api/auth/login', {
				method: 'POST',
				body: validatedData
			})

			return response
		} catch (error) {
			console.error('Login error:', error)
			throw error
		} finally {
			authState.loading = false
		}
	}

	const verifyOTP = async (phone: string, otp: string) => {
		authState.loading = true
		try {
			console.log('verifyOTP called with:', { phone, otp })

			const validatedData = VerifyOTPRequest.parse({ phone, code: otp })

			console.log('Validated data:', validatedData)

			const response = await $fetch('/api/auth/verify-otp', {
				method: 'POST',
				body: validatedData
			})

			console.log('API response:', response)

			const validatedResponse = VerifyOTPResponse.parse(response)

			const validatedUser = User.parse(validatedResponse.user)

			const TokenSchema = z.string().min(1)
			TokenSchema.parse(validatedResponse.accessToken)
			if (validatedResponse.refreshToken) {
				TokenSchema.parse(validatedResponse.refreshToken)
			}

			authState.user = validatedUser
			authState.accessToken = validatedResponse.accessToken
			authState.refreshToken = validatedResponse.refreshToken
			authState.isAuthenticated = true

			persistTokens()

			console.log('Auth state updated:', { user: validatedUser, isAuthenticated: true })

			return validatedResponse
		} catch (error) {
			console.error('OTP verification error:', error)
			throw error
		} finally {
			authState.loading = false
		}
	}

	const logout = async () => {
		try {
			if (authState.refreshToken) {
				await $fetch('/api/auth/logout', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${authState.accessToken}`
					}
				})
			}
		} catch (error) {
			console.error('Logout error:', error)
		} finally {
			clearAuth()
		}
	}

	const refreshTokens = async () => {
		if (!authState.refreshToken) throw new Error('No refresh token')

		try {
			const RefreshTokenSchema = z.string().min(1)
			const validRefreshToken = RefreshTokenSchema.parse(authState.refreshToken)

			const RefreshRequestSchema = z.object({
				refreshToken: z.string().min(1)
			})

			const requestBody = RefreshRequestSchema.parse({
				refreshToken: validRefreshToken
			})

			const response = await $fetch('/api/auth/refresh', {
				method: 'POST',
				body: requestBody
			})

			const RefreshResponseSchema = z.object({
				accessToken: z.string().min(1)
			})

			const validatedResponse = RefreshResponseSchema.parse(response)

			authState.accessToken = validatedResponse.accessToken
			persistTokens()

			return validatedResponse.accessToken
		} catch (error) {
			console.error('Token refresh error:', error)
			clearAuth()
			throw error
		}
	}

	const persistTokens = () => {
		if (import.meta.client) {
			try {
				const validatedState = AuthStateSchema.parse({
					user: authState.user,
					accessToken: authState.accessToken,
					refreshToken: authState.refreshToken,
					isAuthenticated: authState.isAuthenticated,
					loading: false
				})

				const PersistedAuthSchema = z.object({
					accessToken: z.string().nullable(),
					refreshToken: z.string().nullable(),
					user: User.nullable()
				})

				const persistedData = PersistedAuthSchema.parse({
					accessToken: validatedState.accessToken,
					refreshToken: validatedState.refreshToken,
					user: validatedState.user
				})

				localStorage.setItem('auth-tokens', JSON.stringify(persistedData))
			} catch (error) {
				console.error('Error persisting auth data:', error)
			}
		}
	}

	const loadPersistedAuth = () => {
		if (import.meta.client) {
			try {
				const stored = localStorage.getItem('auth-tokens')
				if (stored) {
					const PersistedAuthSchema = z.object({
						accessToken: z.string().nullable(),
						refreshToken: z.string().nullable(),
						user: User.nullable()
					})

					const parsed = JSON.parse(stored)
					const validatedData = PersistedAuthSchema.parse(parsed)

					if (validatedData.accessToken && validatedData.user) {
						const validUser = User.parse(validatedData.user)

						authState.accessToken = validatedData.accessToken
						authState.refreshToken = validatedData.refreshToken
						authState.user = validUser
						authState.isAuthenticated = true

						console.log('[useAuth] Persisted auth loaded:', {
							phone: validUser.phone,
							role: validUser.role
						})
					}
				}
			} catch (error) {
				console.error('Error loading persisted auth:', error)
				clearAuth()
			}
		}
	}

	const clearAuth = () => {
		const clearedState = AuthStateSchema.parse({
			user: null,
			accessToken: null,
			refreshToken: null,
			isAuthenticated: false,
			loading: false
		})

		authState.user = clearedState.user
		authState.accessToken = clearedState.accessToken
		authState.refreshToken = clearedState.refreshToken
		authState.isAuthenticated = clearedState.isAuthenticated

		if (import.meta.client) {
			localStorage.removeItem('auth-tokens')
		}
	}

	const loadAdminStats = async () => {
		if (!isAdmin.value) {
			throw new Error('Access denied: Admin required')
		}

		adminState.loading = true
		adminState.error = null

		try {
			const response = await $fetch('/api/admin/metrics')
			const validatedStats = AdminStatsSchema.parse(response)
			adminState.stats = validatedStats
			return validatedStats
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load statistics'
			adminState.error = errorMessage
			console.error('Admin stats error:', err)
			throw err
		} finally {
			adminState.loading = false
		}
	}

	const loadAdminUsers = async () => {
		if (!isAdmin.value) {
			throw new Error('Access denied: Admin required')
		}

		adminState.loading = true
		adminState.error = null

		try {
			const response = await $fetch('/api/admin/users')
			const UsersArraySchema = z.array(AdminUserSchema)
			const validatedUsers = UsersArraySchema.parse(response)

			adminState.users = validatedUsers
			return validatedUsers
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load users'
			adminState.error = errorMessage
			console.error('Admin users error:', err)
			throw err
		} finally {
			adminState.loading = false
		}
	}

	const loadAdminVehicles = async () => {
		if (!isAdmin.value) {
			throw new Error('Access denied: Admin required')
		}

		adminState.loading = true
		adminState.error = null

		try {
			const response = await $fetch('/api/admin/vehicles')
			const VehiclesArraySchema = z.array(AdminVehicleSchema)
			const validatedVehicles = VehiclesArraySchema.parse(response)

			adminState.vehicles = validatedVehicles
			return validatedVehicles
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'Failed to load vehicles'
			adminState.error = errorMessage
			console.error('Admin vehicles error:', err)
			throw err
		} finally {
			adminState.loading = false
		}
	}

	return {
		user,
		accessToken,
		refreshToken,
		isAuthenticated,
		loading,

		isAdmin,
		currentUser,
		userName,
		userInitials,

		register,
		login,
		verifyOTP,
		logout,
		refreshTokens,
		persistTokens,
		loadPersistedAuth,
		clearAuth,

		adminStats: toRef(adminState, 'stats'),
		adminUsers: toRef(adminState, 'users'),
		adminVehicles: toRef(adminState, 'vehicles'),
		adminLoading: toRef(adminState, 'loading'),
		adminError: toRef(adminState, 'error'),
		loadAdminStats,
		loadAdminUsers,
		loadAdminVehicles
	}
}
