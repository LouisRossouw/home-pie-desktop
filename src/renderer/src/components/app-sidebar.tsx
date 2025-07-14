import { Box, CircleDollarSign, Home, Settings, X } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '~/components/ui/sidebar'
import { Button } from './ui/button'
import { Link } from 'react-router'

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home
  },
  {
    title: 'Projects',
    url: '/projects',
    icon: Box
  },
  {
    title: 'My Finances',
    url: '/my-finances',
    icon: CircleDollarSign
  },

  {
    title: 'Settings',
    url: '/settings',
    icon: Settings
  }
]

export function AppSidebar({ close }: { close: () => void }) {
  return (
    <Sidebar side="right">
      <SidebarHeader className="p-4">
        <div className="flex w-full justify-end">
          <Button variant={'ghost'} size={'sm'} onClick={close}>
            <X />
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="border-y">
        <SidebarGroup className="h-full flex justify-center">
          <SidebarGroupLabel>Nav</SidebarGroupLabel>
          <div>
            <SidebarGroupContent className="border-y py-4">
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild onClick={close}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs">Account Here *</p>
      </SidebarFooter>
    </Sidebar>
  )
}
