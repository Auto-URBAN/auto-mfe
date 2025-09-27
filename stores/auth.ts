import { defineStore } from 'pinia'
import { 
  User, 
  AuthState, 
  RegisterRequest, 
  LoginRequest, 
  VerifyOTPRequest, 
  VerifyOTPResponse,
  type User as UserType,
  type AuthState as AuthStateType
} from '~/schemas'

export const useAuthStore = defineStore('auth', {
  state: (): AuthStateType => ({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    isAdmin: (state) => state.user?.role === 'ADMIN',
    currentUser: (state) => state.user,
    userName: (state): string => {
      if (state.user?.phone) return state.user.phone
      return 'Usuário'
    },
    userInitials: (state): string => {
      if (state.user?.phone) {
        const phoneDigits = state.user.phone.replace(/\D/g, '')
        return phoneDigits.slice(-2).toUpperCase()
      }
      return 'U'
    }
  },

  actions: {
    async register(phone: string) {
      this.loading = true
      try {
        // Validate input
        const validatedData = RegisterRequest.parse({ phone })
        
        const response = await $fetch('/api/auth/register', {
          method: 'POST',
          body: validatedData
        })
        return response
      } catch (error) {
        console.error('Register error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(phone: string) {
      this.loading = true
      try {
        // Validate input
        const validatedData = LoginRequest.parse({ phone })
        
        const response = await $fetch('/api/auth/login', {
          method: 'POST',
          body: validatedData
        })
        return response
      } catch (error) {
        console.error('Login error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async verifyOTP(phone: string, code: string) {
      this.loading = true
      try {
        // Validate input
        const validatedData = VerifyOTPRequest.parse({ phone, code })
        
        const response = await $fetch('/api/auth/verify-otp', {
          method: 'POST',
          body: validatedData
        })

        // Validate response
        const validatedResponse = VerifyOTPResponse.parse(response)

        this.accessToken = validatedResponse.accessToken
        this.refreshToken = validatedResponse.refreshToken
        this.user = User.parse(validatedResponse.user)
        this.isAuthenticated = true

        // Persist tokens
        this.persistTokens()
        
        return validatedResponse
      } catch (error) {
        console.error('OTP verification error:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        if (this.refreshToken) {
          await $fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${this.accessToken}`
            }
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
      }
    },

    async refreshTokens() {
      if (!this.refreshToken) throw new Error('No refresh token')
      
      try {
        const response = await $fetch<{ accessToken: string }>('/api/auth/refresh', {
          method: 'POST',
          body: { refreshToken: this.refreshToken }
        })
        
        this.accessToken = response.accessToken
        this.persistTokens()
        
        return response.accessToken
      } catch (error) {
        console.error('Token refresh error:', error)
        this.clearAuth()
        throw error
      }
    },

    persistTokens() {
      if (import.meta.client) {
        try {
          const authData = AuthState.parse({
            user: this.user,
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            isAuthenticated: this.isAuthenticated,
            loading: false
          })
          
          localStorage.setItem('auth-tokens', JSON.stringify({
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken,
            user: authData.user
          }))
        } catch (error) {
          console.error('Error persisting auth data:', error)
        }
      }
    },

    loadPersistedAuth() {
      if (import.meta.client) {
        const stored = localStorage.getItem('auth-tokens')
        if (stored) {
          try {
            const parsed = JSON.parse(stored)
            
            // Validate stored data
            if (parsed.accessToken && parsed.user) {
              this.accessToken = parsed.accessToken
              this.refreshToken = parsed.refreshToken
              this.user = User.parse(parsed.user)
              this.isAuthenticated = true
            }
          } catch (error) {
            console.error('Error loading persisted auth:', error)
            this.clearAuth()
          }
        }
      }
    },

    clearAuth() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.isAuthenticated = false
      
      if (import.meta.client) {
        localStorage.removeItem('auth-tokens')
      }
    }
  }
})