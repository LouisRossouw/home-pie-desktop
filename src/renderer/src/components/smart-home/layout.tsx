import { Outlet } from 'react-router'

// TODO; Layout

export function SmartHomeLayout({
  data,
  isLoading,
  refetch
}: {
  data: any
  isLoading: boolean
  refetch: () => void
}) {
  return <Outlet context={{ data, isLoading, refetch }} />
}
