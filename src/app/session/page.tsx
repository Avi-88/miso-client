'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import VoiceRoom from '@/components/LiveKitRoom'

export default function Session() {
  const [sessionData, setSessionData] = useState<{
    token: string
    serverUrl: string
    roomName: string
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token')
    const userData = localStorage.getItem('user')
    
    if (!token || !userData) {
      router.push('/auth/signin')
      return
    }
    
    setIsAuthenticated(true)
    setUser(JSON.parse(userData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')
    router.push('/')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const startSession = async () => {
    setIsLoading(true)
    // TODO: Implement session creation logic with API
    // This will call the backend to create a session and get LiveKit token
    setIsLoading(false)
  }

  const handleDisconnect = () => {
    setSessionData(null)
  }

  if (sessionData) {
    return (
      <VoiceRoom
        token={sessionData.token}
        serverUrl={sessionData.serverUrl}
        roomName={sessionData.roomName}
        onDisconnect={handleDisconnect}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {/* User info and logout */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-left">
              <p className="text-sm text-gray-600">Welcome back,</p>
              <p className="font-semibold text-gray-900">{user?.name || user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-800 border border-gray-300 px-3 py-1 rounded-md hover:border-gray-400 transition-colors"
            >
              Logout
            </button>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Ready for your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              therapy session?
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            Connect with our AI therapist for a supportive voice conversation.
          </p>

          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <button
                onClick={startSession}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50"
              >
                {isLoading ? 'Starting...' : 'Start New Session'}
              </button>
              
              <button
                onClick={startSession}
                disabled={isLoading}
                className="border-2 border-gray-300 text-gray-700 font-semibold py-4 px-6 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all"
              >
                Continue Previous Session
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">
                Your conversations are private and secure
              </p>
              <div className="flex justify-center space-x-4 text-xs text-gray-400">
                <span>🔒 End-to-end encrypted</span>
                <span>🎯 Personalized responses</span>
                <span>🗣️ Natural voice interaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}