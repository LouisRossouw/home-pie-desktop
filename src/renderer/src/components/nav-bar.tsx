import { Anvil, Blend, Cone, Cookie, FolderGit, Menu, Pizza, Shield } from 'lucide-react'
import { Button } from './ui/button'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router'

// TODO; Maybe load dynamic menus based on what app is selected.
const menus = [
  {
    title: 'A',
    icon: Pizza,
    route: '/',
    subMenus: [
      { title: 'Something-1', icon: Anvil, url: '' },
      { title: 'Something-2', icon: Blend, url: '' },
      { title: 'Something-3', icon: Cookie, url: '' }
    ]
  },
  {
    title: 'Projects',
    icon: FolderGit,
    route: 'projects',
    subMenus: [
      { title: 'overview', icon: Cone, url: '/projects' },
      { title: 'projects-settings', icon: Shield, url: '/projects/project-settings' }
    ]
  }
]

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
                key={subMenu.title}
                variant={'ghost'}
                size={'sm'}
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
