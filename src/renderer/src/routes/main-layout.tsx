import { useMemo, useState } from 'react'
import { Outlet } from 'react-router'
import { NavBar } from '~/components/nav-bar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/app-sidebar'
import { buildThemeClasses } from '~/libs/utils/update-theme-ui'
import { cn } from '~/libs/utils/cn'
import { useApp } from '~/libs/context/app'
import { Themes } from '~/libs/themes'

export function MainLayout() {
  const { appSettings } = useApp()
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const classes = useMemo(() => {
    const currentTheme = appSettings?.theme as Themes
    return buildThemeClasses({
      currentTheme,
      overrides: {
        border: 'border-x'
      }
    })
  }, [appSettings])

  return (
    <div className={cn('h-[calc(100vh-64px)] bg-background', ...classes)}>
      <SidebarProvider
        style={{
          // @ts-ignore
          '--sidebar-width': '10rem'
        }}
        open={sideBarOpen}
      >
        <div className="w-full">
          <AppSidebar close={() => setSideBarOpen(false)} />
          <NavBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  )
}
