'use client'

import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect, ReactNode } from "react"
import { apiClient } from '@/lib/api'

interface AuthenticatedLayoutProps {
  children: ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [sessions, setSessions] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [loadingMore, setLoadingMore] = useState(false)
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      try {
        // Try to fetch user sessions to verify authentication via HTTP-only cookies
        const sessionsResponse = await apiClient.getUserSessions(1, 10)
        
        // Check if it's specifically an authentication error (401)
        if (sessionsResponse.error && (sessionsResponse as any).status === 401) {
          // Authentication failed, redirect to signin
          router.push('/auth/signin')
          return
        }
        
        // Get user data from localStorage
        const userData = localStorage.getItem('user')
        if (!userData) {
          // No user data cached, redirect to signin
          router.push('/auth/signin')
          return
        }
        
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
        
        // If sessions fetch was successful, use the data
        if (sessionsResponse.data) {
          setSessions(sessionsResponse.data.sessions_by_month || [])
          setPagination(sessionsResponse.data.pagination || null)
        } else {
          // Sessions fetch failed due to network/server error, but user is authenticated
          // Continue with empty sessions - user can try again later
          console.warn('Failed to fetch sessions:', sessionsResponse.error)
          setSessions([])
          setPagination(null)
        }
        
      } catch (error) {
        console.error('Auth check failed:', error)
        // Network errors shouldn't redirect to signin, just show error state
        setIsLoading(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthAndFetchData()
  }, [router])

  const loadMoreSessions = async () => {
    if (!pagination?.has_next || loadingMore) return
    
    setLoadingMore(true)
    try {
      const nextPage = pagination.current_page + 1
      const sessionsResponse = await apiClient.getUserSessions(nextPage, 10)
      
      if (sessionsResponse.data) {
        const newSessionsByMonth = sessionsResponse.data.sessions_by_month || []
        
        // Merge new sessions with existing ones by month
        const mergedSessions = [...sessions]
        
        newSessionsByMonth.forEach((newMonth: any) => {
          const existingMonthIndex = mergedSessions.findIndex(
            (month: any) => month.month_key === newMonth.month_key
          )
          
          if (existingMonthIndex >= 0) {
            // Merge sessions for existing month
            mergedSessions[existingMonthIndex].sessions = [
              ...mergedSessions[existingMonthIndex].sessions,
              ...newMonth.sessions
            ]
          } else {
            // Add new month
            mergedSessions.push(newMonth)
          }
        })
        
        setSessions(mergedSessions)
        setPagination(sessionsResponse.data.pagination || null)
      }
    } catch (error) {
      console.error('Failed to load more sessions:', error)
    } finally {
      setLoadingMore(false)
    }
  }

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

  if (!isAuthenticated) {
    return null
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
      <AppSidebar 
        variant="inset" 
        user={user} 
        sessions={sessions} 
        pagination={pagination}
        loadingMore={loadingMore}
        onLoadMore={loadMoreSessions}
      />
      <SidebarInset>
        <div className="flex flex-1 flex-col relative">
          <SidebarTrigger onClick={() => setOpen(!open)} className="bg-gray-100 p-4 mt-2 ml-2" />
          <div className="@container/main flex flex-1  justify-center items-center flex-col gap-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}