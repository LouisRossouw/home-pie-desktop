import { useEffect } from 'react'
import { useLocation } from 'react-router'

import { useApp } from '~/libs/context/app'

export function useRenderTimer() {
  const { pathname } = useLocation()
  const { appSettings, startRenderTime } = useApp()

  const isDebugMode = appSettings?.debug

  useEffect(() => {
    if (!isDebugMode) return

    const duration = calculateRenderTime(startRenderTime.current)

    console.log(`${pathname} render time: ${duration.toFixed(2)}ms`)
    // timtime.current = null
  }, [pathname, isDebugMode])
}

export function calculateRenderTime(time: number | null) {
  const endTime = performance.now()
  return endTime - (time ?? endTime)
}
