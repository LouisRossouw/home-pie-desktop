import { Box, Bug, CircleDollarSign, Home, Settings, X } from 'lucide-react'

import { useNav } from '~/libs/hooks/use-navigation'
import { useApp } from '~/libs/context/app'

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
  const { navigateTo } = useNav()
  const { appSettings } = useApp()

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
                    <SidebarMenuButton
                      asChild
                      onClick={() => {
                        close()
                        navigateTo(item.url)
                      }}
                      variant={'outline'}
                    >
                      <div>
                        <item.icon />
                        <span>{item.title}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>

            <div className="py-4">
              {appSettings?.debug && (
                <Button
                  className="w-full"
                  variant={'outline'}
                  onClick={() => {
                    close()
                    navigateTo('debug')
                  }}
                >
                  <Bug />
                </Button>
              )}
            </div>
          </div>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <p className="text-xs">Account Here *</p>
      </SidebarFooter>
    </Sidebar>
  )
}
