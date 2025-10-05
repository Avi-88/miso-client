"use client"

import { type Icon } from "@tabler/icons-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
  }[]
}) {
  const router = useRouter();
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem className="bg-orange-400 hover:bg-orange-600 hover:text-white  rounded-lg text-white " onClick={()=> router.push(item.url)} key={item.title}>
              <SidebarMenuButton className="flex justify-center items-center bg-orange-400 hover:bg-orange-500 hover:text-white" tooltip={item.title}>
                {item.icon && <item.icon />}
                <span className="text-xs font-bold">{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
