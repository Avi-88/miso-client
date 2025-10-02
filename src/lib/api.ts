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
  id: string
  room_name: string
  token: string
  session_id: string
  is_resume?: boolean
  previous_session_id?: string
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
  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  async signIn(credentials: SignInRequest): Promise<ApiResponse<{ access_token: string; user: User }>> {
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

  async createSession(token: string, request: CreateSessionRequest = {}): Promise<ApiResponse<Session>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/create-session`, {
        method: 'POST',
        headers: this.getAuthHeaders(token),
        body: JSON.stringify(request),
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

  async getSessionHistory(token: string): Promise<ApiResponse<{ sessions: any[] }>> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/session-history`, {
        method: 'GET',
        headers: this.getAuthHeaders(token),
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
}

export const apiClient = new ApiClient()