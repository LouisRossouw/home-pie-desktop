import { useState } from 'react'
import { Outlet } from 'react-router'
import { NavBar } from '~/components/nav-bar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/app-sidebar'

export function MainLayout() {
  const [sideBarOpen, setSideBarOpen] = useState(false)

  return (
    <div className="h-[calc(100vh-64px)] bg-background">
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
