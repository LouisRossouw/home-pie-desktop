import { Link } from 'react-router'

export function NavBar() {
  return (
    <nav className="flex w-full p-2">
      <ul className="flex gap-4">
        <li>
          <Link to="/home">Home</Link>
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
      </ul>
    </nav>
  )
}
