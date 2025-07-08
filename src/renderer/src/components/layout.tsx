import { Link, Outlet, useNavigate } from 'react-router'
import { Cog } from 'lucide-react'
import { Button } from './ui/button'

export function Layout() {
  const nav = useNavigate()

  return (
    <div className="w-full h-full">
      {/* A "layout route" is a good place to put markup you want to
          share across all the pages on your site, like navigation. */}
      <nav className="flex w-full bg-blue-400">
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
          <li>
            <Link to="/splash">Splash</Link>
          </li>

          {/* <Button variant={'default'} onClick={() => nav('about')}>
            <Cog size={18} />
          </Button> */}
        </ul>
      </nav>

      <hr />

      {/* An <Outlet> renders whatever child route is currently active,
          so you can think about this <Outlet> as a placeholder for
          the child routes we defined above. */}
      <Outlet />

      <div className="bg-blue-500 w-full">Debug</div>
    </div>
  )
}
