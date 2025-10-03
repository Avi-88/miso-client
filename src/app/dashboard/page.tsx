'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { AIAgentSphere } from "@/components/ai-agent-sphere"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { IconX } from "@tabler/icons-react"

export default function Page() {
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAgentActive, setIsAgentActive] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)


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

  const handleStartSession = () => {
    setIsAgentActive(true)
    setOpen(false)
    // Here you would integrate with LiveKit to start the session
    // For now, we'll just activate the sphere
    console.log('Starting AI session...')
  }

  if (!isAuthenticated) {
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
    <SidebarProvider
      open={open} 
      onOpenChange={setOpen}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset >
        <div className="flex flex-1 flex-col relative">
          <SidebarTrigger onClick={()=>setOpen(!open)} className="bg-gray-100 p-4 mt-2 ml-2" />
          <div className="@container/main flex flex-1 justify-center items-center flex-col gap-8 p-8">
            {/* Main AI Agent Display */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Hey {user.name}!</h1>
              <p className="text-sm text-gray-600 max-w-2xl">
                meet <span className="text-orange-400">Miso</span> , your compassionate AI-powered companion
              </p>
            </div>

            {/* AI Agent Sphere */}
            <AIAgentSphere 
              isActive={isAgentActive}
              onActivate={handleStartSession}
              size="xl"
            />

            {/* Session Status */}
            {isAgentActive && (
              <button
                onClick={() => setIsAgentActive(false)}
                className="px-4 py-2 rounded-4xl bg-red-600 hover:bg-orange-700 text-white transition-colors flex items-center justify-center"
              >
                <IconX height={20} className="mr-2" width={20} />
                End Session
              </button>
            )}

            {/* Additional Info */}
            {!isAgentActive && 
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
                <div className="text-center p-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Voice-First</h3>
                  <p className="text-gray-600 text-xs">Natural voice conversations with AI that understands and responds with empathy</p>
                </div>
  
                <div className="text-center p-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Compassionate</h3>
                  <p className="text-gray-600 text-xs">Designed with empathy and understanding to provide a safe space for emotional support</p>
                </div>
  
                <div className="text-center p-4">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Private & Secure</h3>
                  <p className="text-gray-600 text-xs">Your conversations are private and secure, with full control over your data</p>
                </div>
              </div>
            }
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
