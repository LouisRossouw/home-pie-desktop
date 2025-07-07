import { Link, Outlet, useNavigate } from 'react-router'
import { Button } from './ui/button'
import { Cog, CogIcon } from 'lucide-react'

export function Layout() {
  const nav = useNavigate()

  return (
    <div className="w-full h-full">
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav className="flex w-full bg-red-500 h-[45px]">
        <ul className="flex gap-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>

          <Button variant={'outline'} onClick={() => nav('about')}>
            <CogIcon size={18} color="black" />
          </Button>
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />
    </div>
  )
}
