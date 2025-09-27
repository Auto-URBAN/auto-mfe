/**
 * API client with interceptors for Auto URBAN
 * Handles authentication, retries, and error handling
 */

export interface APIError extends Error {
  statusCode?: number
  statusMessage?: string
}

export class APIClient {
  private baseURL: string

  constructor(baseURL = '/api') {
    this.baseURL = baseURL
  }

  private async request<T = any>(
    url: string, 
    options: {
      method?: string
      body?: any
      headers?: Record<string, string>
      retry?: boolean
      skipAuth?: boolean 
      query?: Record<string, any>
    } = {}
  ): Promise<T> {
    const { retry = true, skipAuth = false, method = 'GET', body, headers: customHeaders, query } = options
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders
    }

    // Add auth token if available and not skipped
    if (!skipAuth && import.meta.client) {
      const { useAuth } = await import('#imports')
      const auth = useAuth()
      if (auth.accessToken.value) {
        headers.Authorization = `Bearer ${auth.accessToken.value}`
      }
    }

    try {
      const response = await $fetch<T>(`${this.baseURL}${url}`, {
        method: method as any,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        query
      })

      return response
    } catch (error: any) {
      // Handle 401 - try refresh token
      if (error.statusCode === 401 && retry && !skipAuth && import.meta.client) {
        try {
          const { useAuth } = await import('#imports')
          const auth = useAuth()
          await auth.refreshTokens()
          
          // Retry original request
          return this.request<T>(url, { ...options, retry: false })
        } catch (refreshError) {
          // Refresh failed, redirect to login
          const { useAuth } = await import('#imports')
          const auth = useAuth()
          auth.clearAuth()
          
          if (import.meta.client) {
            await navigateTo('/auth/login')
          }
          
          throw refreshError
        }
      }

      // Re-throw other errors
      const apiError: APIError = new Error(error.statusMessage || error.message || 'API Error')
      apiError.statusCode = error.statusCode
      apiError.statusMessage = error.statusMessage
      
      throw apiError
    }
  }

  async get<T = any>(url: string, options: { query?: Record<string, any>; skipAuth?: boolean; headers?: Record<string, string> } = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  async post<T = any>(url: string, body?: any, options: { skipAuth?: boolean; headers?: Record<string, string> } = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body
    })
  }

  async put<T = any>(url: string, body?: any, options: { skipAuth?: boolean; headers?: Record<string, string> } = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body
    })
  }

  async delete<T = any>(url: string, options: { skipAuth?: boolean; headers?: Record<string, string> } = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  async patch<T = any>(url: string, body?: any, options: { skipAuth?: boolean; headers?: Record<string, string> } = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body
    })
  }
}

// Export singleton instance
export const apiClient = new APIClient()

// Helper function for quick access
export const api = {
  get: apiClient.get.bind(apiClient),
  post: apiClient.post.bind(apiClient),
  put: apiClient.put.bind(apiClient),
  delete: apiClient.delete.bind(apiClient),
  patch: apiClient.patch.bind(apiClient)
}