import { useEffect, useRef } from 'react'
import { IpcRendererEvent } from 'electron'

import { useApp } from '~/libs/context/app'

type Size = { x: number; y: number; width: number; height: number }

export function WindowResizeListener() {
  const { updateAppSettings } = useApp()

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  // TODO; Only updateAppSettings resize values
  // if user is NOT on splash screem login screen, onboarding screen

  useEffect(() => {
    const cleanup = setupResizeListener()
    return cleanup
  }, [])

  function setupResizeListener() {
    const handler = (_event: IpcRendererEvent, size: Size) => {
      // Clear any existing debounce timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }

      debounceTimeout.current = setTimeout(() => {
        console.log('TODO; Updated window size:', size)

        // TODO; Only allow this to run if user is
        // manually adjusting the width/height of the app

        // updateAppSettings([
        //   { setting: 'appWidth', value: size.width },
        //   { setting: 'appHeight', value: size.height }
        // ])
      }, 500)
    }

    window.api.onWindowResize(handler)
    console.log('ResizeListener mounted.')

    return () => {
      window.api.removeListener(handler, 'window-resized')
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
      }
    }
  }

  return null
}
