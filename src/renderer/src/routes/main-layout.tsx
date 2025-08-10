import { useState } from 'react'
import { Outlet } from 'react-router'
import { NavBar } from '~/components/nav-bar'
import { SidebarProvider } from '~/components/ui/sidebar'
import { AppSidebar } from '~/components/app-sidebar'
import { Star } from 'lucide-react'

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
          {sideBarOpen && (
            <div
              className="fixed w-full h-[calc(100%-32px)] backdrop-blur-xs z-10 rounded-lg animate-in fade-in duration-400 ease-in-out bg-background/40"
              onClick={() => setSideBarOpen(false)}
            >
              <QuickLinks />
            </div>
          )}
          <NavBar sideBarOpen={sideBarOpen} setSideBarOpen={setSideBarOpen} />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  )
}

function QuickLinks() {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <div className="border rounded-lg p-4">
        <div className="flex w-full items-center justify-center ">
          <Star />
        </div>
        <h3>TODO; Add quick links to specific routes / apps *</h3>
      </div>
    </div>
  )
}
