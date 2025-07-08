import { Outlet } from 'react-router'
import { NavBar } from '~/components/nav-bar'

export function MainLayout() {
  return (
    <div className="App_window w-full h-[calc(100vh-64px)] bg-background">
      <NavBar />
      <hr />
      <Outlet />
    </div>
  )
}
