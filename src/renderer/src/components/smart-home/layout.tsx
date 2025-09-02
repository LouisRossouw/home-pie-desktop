import { Outlet } from 'react-router'

// TODO; Layout

export function SmartHomeLayout({ data, refetch }: { data: any; refetch: () => void }) {
  return <Outlet context={{ data, refetch }} />
}
