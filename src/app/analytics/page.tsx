'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

function Analytics() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard since analytics is work in progress
    router.replace('/dashboard')
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default Analytics