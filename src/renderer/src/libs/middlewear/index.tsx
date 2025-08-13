import { useLocation } from 'react-router'

import { RouterListener } from './router-listener'
import { DotSquadListener } from './dot-squad-listener'
import { WindowResizeListener } from './resize-listener'

export function Middlewear() {
  const { pathname } = useLocation()

  // Updates the main process on what route the app is currently on.
  window.api.nav.syncRoute(pathname === '/' ? pathname : pathname.replace('/', ''))

  return (
    <>
      <RouterListener />
      <DotSquadListener />
      <WindowResizeListener />
    </>
  )
}
