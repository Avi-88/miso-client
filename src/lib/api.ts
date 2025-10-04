const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000'

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface User {
  id: string
  email: string
  name?: string
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
  name?: string
}

export interface CreateSessionRequest {
  session_id?: string
}

export class ApiClient {
  private async refreshToken(): Promise<string | null> {
    const refreshToken = localStorage.getItem('refresh_token')
    
    if (!refreshToken) {
      return null
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!response.ok) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        window.location.href = '/auth/signin'
        return null
      }

      const data = await response.json()
      localStorage.setItem('auth_token', data.access_token)
      
      if (data.refresh_token) {
        localStorage.setItem('refresh_token', data.refresh_token)
      }
      
      return data.access_token
    } catch (error) {
      console.error('Token refresh failed:', error)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      window.location.href = '/auth/signin'
      return null
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Math.floor(Date.now() / 1000)
      return payload.exp < currentTime
    } catch {
      return true
    }
  }

  private async getValidToken(): Promise<string | null> {
    let token = localStorage.getItem('auth_token')
    
    if (!token) {
      return null
    }

    if (this.isTokenExpired(token)) {
      token = await this.refreshToken()
    }

    return token
  }

  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private async makeAuthenticatedRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getValidToken()
      
      if (!token) {
        return { error: 'Authentication required' }
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getAuthHeaders(token),
          ...options.headers,
        },
      })

      if (response.status === 401) {
        // Token might be invalid, try refreshing once more
        const newToken = await this.refreshToken()
        if (newToken) {
          const retryResponse = await fetch(url, {
            ...options,
            headers: {
              ...this.getAuthHeaders(newToken),
              ...options.headers,
            },
          })
          
          if (!retryResponse.ok) {
            const error = await retryResponse.text()
            return { error }
          }
          
          const data = await retryResponse.json()
          return { data }
        } else {
          return { error: 'Authentication failed' }
        }
      }

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

  async signIn(credentials: SignInRequest): Promise<ApiResponse<{ access_token: string; user: User, refresh_token: string }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signin`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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

  async signUp(credentials: SignUpRequest): Promise<ApiResponse<{ message: string; user: User }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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

  async getSessionHistory(): Promise<ApiResponse<{ sessions: any[] }>> {
    return this.makeAuthenticatedRequest<{ sessions: any[] }>(`${API_BASE_URL}/api/session-history`, {
      method: 'GET',
    })
  }

  logout(): void {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    window.location.href = '/auth/signin'
  }
}

export const apiClient = new ApiClient()