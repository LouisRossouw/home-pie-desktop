import { Outlet } from 'react-router'

export default function ServersRoute() {
  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <Outlet />
    </div>
  )
}
