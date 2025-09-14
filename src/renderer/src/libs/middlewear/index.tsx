import { useLocation } from 'react-router'

import { RouterListener } from './router-listener'
import { WindowResizeListener } from './resize-listener'
import { ProcessListener } from './process-listener'
import { AuthListener } from './auth-listener'

// TODO; Rename to listeners

export function Middlewear() {
  const { pathname } = useLocation()

  // Updates the main process on what route the app is currently on.
  window.api.nav.syncRoute(pathname === '/' ? pathname : pathname.replace('/', ''))

  return (
    <>
      <RouterListener />
      {/* <DotSquadListener /> */}
      <AuthListener />
      <WindowResizeListener />
      <ProcessListener />
    </>
  )
}
