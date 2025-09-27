// useAuth composable - replacement for Pinia auth store
import { 
  User, 
  AuthState, 
  RegisterRequest, 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse
} from '~/schemas'
import { z } from 'zod'

// Use Zod schemas instead of TypeScript interfaces
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

export const useAuth = () => {
  // Reactive state
  const user = toRef(authState, 'user')
  const accessToken = toRef(authState, 'accessToken')
  const refreshToken = toRef(authState, 'refreshToken')
  const isAuthenticated = toRef(authState, 'isAuthenticated')
  const loading = toRef(authState, 'loading')

  // Computed getters
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

  // Actions
  const register = async (phone: string) => {
    authState.loading = true
    try {
      // Validate input with Zod
      const validatedData = RegisterRequest.parse({ phone })
      
      // Validate phone format specifically
      const PhoneSchema = z.string().min(10).max(15).regex(/^[+]?[1-9][\d]{0,15}$/)
      PhoneSchema.parse(phone)
      
      const response = await $fetch('/api/auth/register', {
        method: 'POST',
        body: validatedData
      })
      
      // Validate response if needed
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
      // Validate input with Zod
      const validatedData = LoginRequest.parse({ phone })
      
      // Additional phone validation
      const PhoneSchema = z.string().min(10).max(15).regex(/^[+]?[1-9][\d]{0,15}$/)
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
      // Validate inputs with Zod
      const validatedData = VerifyOTPRequest.parse({ phone, otp })
      
      // Additional validation schemas
      const PhoneSchema = z.string().min(10).max(15).regex(/^[+]?[1-9][\d]{0,15}$/)
      const OTPSchema = z.string().length(6).regex(/^\d{6}$/) // 6-digit numeric OTP
      
      PhoneSchema.parse(phone)
      OTPSchema.parse(otp)
      
      const response = await $fetch('/api/auth/verify-otp', {
        method: 'POST',
        body: validatedData
      })

      // Parse and validate response with Zod
      const validatedResponse = VerifyOTPResponse.parse(response)
      
      // Validate user data before setting state
      const validatedUser = User.parse(validatedResponse.user)
      
      // Validate tokens
      const TokenSchema = z.string().min(1)
      TokenSchema.parse(validatedResponse.accessToken)
      if (validatedResponse.refreshToken) {
        TokenSchema.parse(validatedResponse.refreshToken)
      }
      
      // Set auth state with validated data
      authState.user = validatedUser
      authState.accessToken = validatedResponse.accessToken
      authState.refreshToken = validatedResponse.refreshToken
      authState.isAuthenticated = true
      
      // Persist to storage
      persistTokens()
      
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
      // Validate refresh token with Zod
      const RefreshTokenSchema = z.string().min(1)
      const validRefreshToken = RefreshTokenSchema.parse(authState.refreshToken)
      
      // Define request body schema
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
      
      // Validate response
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
        // Validate current auth state with Zod
        const validatedState = AuthStateSchema.parse({
          user: authState.user,
          accessToken: authState.accessToken,
          refreshToken: authState.refreshToken,
          isAuthenticated: authState.isAuthenticated,
          loading: false
        })
        
        // Define persisted data schema
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
        
        // Store in localStorage with Zod validation
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
          // Define schema for persisted data validation
          const PersistedAuthSchema = z.object({
            accessToken: z.string().nullable(),
            refreshToken: z.string().nullable(),
            user: User.nullable()
          })
          
          const parsed = JSON.parse(stored)
          const validatedData = PersistedAuthSchema.parse(parsed)
          
          if (validatedData.accessToken && validatedData.user) {
            authState.accessToken = validatedData.accessToken
            authState.refreshToken = validatedData.refreshToken
            authState.user = validatedData.user
            authState.isAuthenticated = true
          }
        }
      } catch (error) {
        console.error('Error loading persisted auth:', error)
        clearAuth()
      }
    }
  }

  const clearAuth = () => {
    // Validate and reset auth state using Zod
    const clearedState = AuthStateSchema.parse({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      loading: false
    })
    
    // Apply cleared state
    authState.user = clearedState.user
    authState.accessToken = clearedState.accessToken
    authState.refreshToken = clearedState.refreshToken
    authState.isAuthenticated = clearedState.isAuthenticated
    
    if (import.meta.client) {
      localStorage.removeItem('auth-tokens')
    }
  }

  // Initialize auth on first use
  if (import.meta.client && !authState.user) {
    loadPersistedAuth()
  }

  return {
    // State
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    loading,
    
    // Getters
    isAdmin,
    currentUser,
    userName,
    userInitials,
    
    // Actions
    register,
    login,
    verifyOTP,
    logout,
    refreshTokens,
    persistTokens,
    loadPersistedAuth,
    clearAuth
  }
}