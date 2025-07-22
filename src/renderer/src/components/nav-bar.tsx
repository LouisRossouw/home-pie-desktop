import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Menu } from 'lucide-react'
import { menus } from '~/libs/menus'

import { Button } from './ui/button'

export function NavBar({
  sideBarOpen,
  setSideBarOpen
}: {
  sideBarOpen: boolean
  setSideBarOpen: (v: boolean) => void
}) {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const routeMenu = useMemo(() => {
    const firstSegment = pathname === '/' ? pathname : pathname.split('/')[1]
    return menus.find((m) => m.route === firstSegment)
  }, [pathname])

  const currentSubRoutes = pathname.split('/')
  const selectedSubRoute = currentSubRoutes[currentSubRoutes.length - 1]

  if (!routeMenu)
    return (
      <nav className="flex h-8 w-full items-center justify-end p-2 ">
        <Button variant={'ghost'} size={'sm'} onClick={() => setSideBarOpen(!sideBarOpen)}>
          <Menu />
        </Button>
      </nav>
    )

  return (
    <nav className="flex h-8 w-full items-center justify-between p-2 border-b">
      <div className="flex gap-4">
        {routeMenu && (
          <div className="border-r flex items-center gap-4 pr-4">
            <routeMenu.icon size={18} />
            {routeMenu.title}
          </div>
        )}
        <div className="flex gap-2">
          {routeMenu?.subMenus.map((subMenu) => {
            return (
              <Button
                size={'sm'}
                key={subMenu.title}
                variant={selectedSubRoute === subMenu.slug ? 'default' : 'outline'}
                onClick={() => {
                  if (!subMenu.url) return alert('No route set')
                  navigate(subMenu.url)
                }}
              >
                <subMenu.icon />
              </Button>
            )
          })}
        </div>
      </div>

      <Button variant={'ghost'} size={'sm'} onClick={() => setSideBarOpen(!sideBarOpen)}>
        <Menu />
      </Button>
    </nav>
  )
}
