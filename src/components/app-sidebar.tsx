"use client"

import * as React from "react"
import {
  IconPhoneSpark,
  IconInnerShadowTop,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-sessions"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar"


const data = {
  navMain: [
    {
      title: "New chat",
      url: "/dashboard",
      icon: IconPhoneSpark,
    },
    // {
    //   title: "Analytics",
    //   url: "/analytics", ---- ( WIP )
    //   icon: IconChartBar,
    // },
  ],
}

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: any
  sessions?: any[]
  pagination?: any
  loadingMore?: boolean
  onLoadMore?: () => void
}

export function AppSidebar({ user, sessions, pagination, loadingMore, onLoadMore, ...props }: AppSidebarProps) {


  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop  className="!size-5 text-orange-400" />
                <span className="text-base font-semibold">Miso</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {sessions && sessions.map((sessionGroup: any) => (
          <NavDocuments 
            key={sessionGroup.month_key} 
            sessionsGroup={sessionGroup} 
          />
        ))}
        {pagination?.has_next && (
          <div className="px-2 py-1 group-data-[collapsible=icon]:hidden">
            <button
              onClick={onLoadMore}
              disabled={loadingMore}
              className="w-full text-xs text-orange-600 hover:bg-orange-300 hover:text-white bg-orange-200 py-2 px-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loadingMore ? 'Loading...' : 'More'}
            </button>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
