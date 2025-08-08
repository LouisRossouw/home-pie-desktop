import { useNavigate } from 'react-router'
import { useApp } from '../context/app'

export function useNav() {
  const navigation = useNavigate()

  const { appSettings, startRenderTime } = useApp()

  function navigateTo(path: string) {
    if (appSettings?.debug) {
      if (startRenderTime) {
        startRenderTime.current = performance.now()
      }
    }

    navigation(path)
  }

  return {
    navigateTo,
    navigation
  }
}
