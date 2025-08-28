import { Box, Bug, CircleDollarSign, Home, Settings, X } from 'lucide-react'

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
import { Link, useNavigate } from 'react-router'
import { useApp } from '~/libs/context/app'
import { useMemo } from 'react'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'
import { Theme, Themes } from '~/libs/themes'

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
  const navigation = useNavigate()
  const { appSettings } = useApp()

  const classes = useMemo(() => {
    const currentTheme = appSettings?.theme as Themes
    return buildThemeClasses({
      currentTheme,
      overrides: {
        border: 'border',
        dontIgnoreText: false,
        reverseGradient: true
      }
    })
  }, [appSettings])

  return (
    <Sidebar side="right">
      <div className={cn('h-full grid', ...classes)}>
        <SidebarHeader className="p-4">
          <div className="flex w-full justify-end">
            <Button variant={'ghost'} size={'sm'} onClick={close}>
              <X />
            </Button>
          </div>
        </SidebarHeader>
        <SidebarContent>
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

              <div className="py-4">
                {appSettings?.debug && (
                  <Button
                    className="w-full"
                    variant={'outline'}
                    onClick={() => {
                      navigation('debug')
                      close()
                    }}
                  >
                    <Bug />
                  </Button>
                )}
              </div>
            </div>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="p-4 justify-end">
          <p className="text-xs">Account Here *</p>
        </SidebarFooter>
      </div>
    </Sidebar>
  )
}
