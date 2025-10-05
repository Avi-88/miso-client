const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  username: string
}

export interface Session {
  room_name: string
  token: string
  session_id: string
}

export interface SignInRequest {
  email: string
  password: string
}

export interface SignUpRequest {
  email: string
  password: string
  username: string
}

export interface CreateSessionRequest {
  session_id?: string
}

export class ApiClient {

  private async refreshToken(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        // Update user data in localStorage if provided
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user))
        }
        return true
      }
      
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      return false
    }
  }

  private async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {},
    retryOnAuth = true
  ): Promise<ApiResponse<T> & { status?: number }> {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Include HTTP-only cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      if (response.status === 401 && retryOnAuth) {
        // Try to refresh token
        const refreshSuccess = await this.refreshToken()
        
        if (refreshSuccess) {
          // Retry the original request once
          return this.makeAuthenticatedRequest(url, options, false)
        } else {
          // Refresh failed, clear user data and redirect
          localStorage.removeItem('user')
          window.location.href = '/auth/signin'
          return { error: 'Authentication failed', status: 401 }
        }
      }

      if (response.status === 401) {
        // Authentication failed after retry - return with status code
        return { error: 'Authentication failed', status: 401 }
      }

      if (!response.ok) {
        const error = await response.text()
        return { error, status: response.status }
      }

      const data = await response.json()
      return { data, status: response.status }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async signIn(credentials: SignInRequest): Promise<ApiResponse<{ user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // Important: Include cookies in requests
      })

      if (!response.ok) {
        const error = await response.text()
        return { error }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async signUp(credentials: SignUpRequest): Promise<ApiResponse<{ message: string; user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        const error = await response.text()
        return { error }
      }

      const data = await response.json()
      return { data }
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  async createSession(request: CreateSessionRequest = {}): Promise<ApiResponse<Session>> {
    return this.makeAuthenticatedRequest<Session>(`${API_BASE_URL}/api/create-session`, {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  async resumeSession(sessionId: string): Promise<ApiResponse<Session>> {
    return this.makeAuthenticatedRequest<Session>(`${API_BASE_URL}/api/resume-session`, {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId }),
    })
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<{ message: string; session_id: string }>> {
    return this.makeAuthenticatedRequest<{ message: string; session_id: string }>(`${API_BASE_URL}/api/delete-session`, {
      method: 'DELETE',
      body: JSON.stringify({ session_id: sessionId }),
    })
  }

  async getUserSessions(page: number = 1, pageSize: number = 10): Promise<ApiResponse<any>> {
    return this.makeAuthenticatedRequest<any>(`${API_BASE_URL}/api/user-sessions?page=${page}&page_size=${pageSize}`, {
      method: 'GET',
    })
  }

  async getSessionData(session_id: string): Promise<ApiResponse<any>> {
    return this.makeAuthenticatedRequest<any>(`${API_BASE_URL}/api/sessions/${session_id}`, {
      method: 'GET',
    })
  }

  async logout(): Promise<void> {
    try {
      // Call signout endpoint to clear HTTP-only cookies
      await fetch(`${API_BASE_URL}/auth/signout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch (error) {
      console.error('Logout request failed:', error)
    } finally {
      // Clear localStorage user data
      localStorage.removeItem('user')
      window.location.href = '/auth/signin'
    }
  }
}

export const apiClient = new ApiClient()