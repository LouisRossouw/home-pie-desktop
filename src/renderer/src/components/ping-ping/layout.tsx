import { Outlet } from 'react-router'

// TODO; Layout

export function PingPingLayout({ data }: { data: any }) {
  return <Outlet context={{ data }} />
}
