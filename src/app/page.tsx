'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user data exists (authentication will be verified by AuthenticatedLayout)
    const user = localStorage.getItem('user')
    
    if (user) {
      // User data exists, redirect to dashboard
      router.push('/dashboard')
      return
    }
    
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Miso
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your compassionate AI-powered voice therapy companion. 
            Experience supportive conversations designed to help you process emotions and build coping strategies.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 bg-blue-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Voice-First</h3>
              <p className="text-gray-600 text-sm">Natural voice conversations with AI that understands and responds with empathy</p>
            </div>

            <div className="p-6 bg-purple-50 rounded-xl">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Compassionate</h3>
              <p className="text-gray-600 text-sm">Designed with empathy and understanding to provide a safe space for emotional support</p>
            </div>

            <div className="p-6 bg-green-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Private & Secure</h3>
              <p className="text-gray-600 text-sm">Your conversations are private and secure, with full control over your data</p>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href="/auth/signin"
              className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started
            </a>
            
            <p className="text-sm text-gray-500">
              New to Miso?{" "}
              <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-medium">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
