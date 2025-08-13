import { useEffect, useRef } from 'react'
import { IpcRendererEvent } from 'electron'

import { OnResize } from '@shared/types'
import { settingKeys } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'

export function WindowResizeListener() {
  const { appSettings, updateAppSettings, resetWindow } = useApp()

  const appWindowMode = useRef('')

  useEffect(() => {
    const cleanup = setupResizeListener()
    return cleanup
  }, [])

  useEffect(() => {
    const maybeMode = appSettings?.appWindowMode as string | undefined
    appWindowMode.current = maybeMode ?? ''
  }, [appSettings?.appWindowMode])

  function handleMovedWindow() {
    if (appWindowMode.current !== '') {
      resetWindow()
    }
    updateAppSettings([{ setting: settingKeys.appWindowMode, value: '' }])
  }

  function handleResizeWindow(size: { width: number; height: number }) {
    updateAppSettings([
      { setting: settingKeys.appWidth, value: size.width },
      { setting: settingKeys.appHeight, value: size.height }
    ])
  }

  function setupResizeListener() {
    const handler = (_event: IpcRendererEvent, data: OnResize) => {
      if (data?.hasMoved) {
        handleMovedWindow()
      } else if (data?.isMoving) {
        // console.log('its moving!')
      } else {
        handleResizeWindow({ width: data.width, height: data.height })
      }
    }

    window.api.app.onWindowResize(handler)
    console.log('ResizeListener mounted.')

    return () => {
      window.api.app.removeListener(handler, 'window-resized')
    }
  }

  return null
}
