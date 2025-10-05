"use client"

import {
  IconDots,
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"
import { useRouter } from 'next/navigation'
import { apiClient } from '@/lib/api'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

export function NavDocuments({
  sessionsGroup
}: {
  sessionsGroup: {
    month_name: string
    month_key: string
    sessions: {
      id: string
      title: string
      started_at: string
      status: string
      mood_score?: number
      duration?: number
    }[]
  }
}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const handleResumeSession = (sessionId: string) => {
    router.push(`/dashboard?resume=${sessionId}`)
  }

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this session? This action cannot be undone.')) {
      return
    }

    try {
      const response = await apiClient.deleteSession(sessionId)
      if (response.error) {
        alert('Failed to delete session: ' + response.error)
      } else {
        // Refresh the page to update the session list
        window.location.reload()
      }
    } catch (error) {
      console.error('Delete session error:', error)
      alert('Failed to delete session')
    }
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{sessionsGroup.month_name}</SidebarGroupLabel>
      <SidebarMenu>
        {sessionsGroup.sessions.map((session) => (
          <SidebarMenuItem key={session.id}>
            <SidebarMenuButton asChild>
              <a href={`/session/${session.id}`}>
                <span className="truncate text-xs">{session.title}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  showOnHover
                  className="data-[state=open]:bg-accent rounded-sm"
                >
                  <IconDots />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-32 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <IconFolder />
                  <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleResumeSession(session.id)}>
                  <IconShare3 />
                  <span>Resume</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive" onClick={() => handleDeleteSession(session.id)}>
                  <IconTrash />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {sessionsGroup.sessions.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="text-sidebar-foreground/50">
              <span>No sessions</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  )
}
