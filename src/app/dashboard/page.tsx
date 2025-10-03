'use client'

import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import data from "./data.json"

export default function Page() {

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


  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SidebarTrigger className="bg-gray-100 p-6"/> 
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 justify-center items-center flex-col gap-2">
            Hello
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
