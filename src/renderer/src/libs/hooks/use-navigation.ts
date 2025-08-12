import { useLocation, useNavigate } from 'react-router'
import { useApp } from '../context/app'

export function useNav() {
  const navigation = useNavigate()

  const { pathname } = useLocation()

  const { appSettings, startRenderTime } = useApp() // TODO; Remove this, it is causing re-rendering

  function navigateTo(path: string) {
    if (appSettings?.debug) {
      if (startRenderTime) {
        startRenderTime.current = performance.now()
      }
    }

    navigation(path)
  }

  function navigateToFromPathname(path: string) {
    if (appSettings?.debug) {
      if (startRenderTime) {
        startRenderTime.current = performance.now()
      }
    }

    const cleanPath = path.replace('/', '')

    navigation(`${pathname}/${cleanPath}`)
  }

  return {
    navigateTo,
    navigateToFromPathname,
    navigation
  }
}
