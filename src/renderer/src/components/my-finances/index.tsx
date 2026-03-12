// import { useMemo } from 'react'
import { Outlet } from 'react-router'

export function MyFinances() {
  // TODO; Common data can be fetched from here and passed to all the components
  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <Outlet />
    </div>
  )
}
