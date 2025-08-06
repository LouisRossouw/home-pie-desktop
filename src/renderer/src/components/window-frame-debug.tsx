import { useRef } from 'react'
import { useLocation } from 'react-router'

import { Bug, House, Star } from 'lucide-react'

import { settingKeys } from '@shared/default-app-settings'

import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { calculateRenderTime } from '~/libs/hooks/use-render-timer'

import { Button } from './ui/button'
import { AppVersion } from './app-version'
import { cn } from '~/libs/utils/cn'

const isDev = import.meta.env.DEV
const mode = import.meta.env.MODE

export function WindowFrameDebug() {
  const countToDebug = useRef(0)
  const { pathname } = useLocation()
  const { navigateTo } = useNav()

  const { appSettings, updateAppSettings, startRenderTime } = useApp()

  function handleDebugRedirect() {
    countToDebug.current += 1

    if (countToDebug.current >= 5) {
      countToDebug.current = 0
      navigateTo('debug')
      updateAppSettings([{ setting: settingKeys.debug, value: true }])
    }
  }

  const isLogin = pathname === '/login'
  const isStartRoute = appSettings?.startRoute === pathname

  if (isLogin) {
    return (
      <div className="flex items-center justify-between h-8 px-4 rounded-b-lg  bg-background"></div>
    )
  }

  const duration = calculateRenderTime(startRenderTime.current)

  return (
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background">
      <div className="grid grid-cols-3 w-full">
        <div className="flex gap-4 justify-start items-center">
          <Button
            variant={'outline'}
            className="w-6 h-6"
            // disabled={isStartRoute}
            onClick={() => {
              if (isStartRoute) return
              updateAppSettings([{ setting: settingKeys.startRoute, value: pathname }])
            }}
          >
            <Star size={18} className={cn(isStartRoute && 'text-accent')} />
          </Button>
          <Button variant={'outline'} className="w-6 h-6" onClick={() => navigateTo('/')}>
            <House size={18} />
          </Button>

          <p className="text-xs">{pathname}</p>
        </div>
        <div className="flex justify-center items-center">
          {isDev && <p className="text-xs">{mode}</p>}
        </div>
        <div className="flex justify-end items-center gap-4">
          {appSettings?.debug && (
            <>
              <p className="text-xs">{`${duration.toFixed(2)}ms`}</p>
              <Button variant={'outline'} className="w-6 h-6" onClick={() => navigateTo('debug')}>
                <Bug />
              </Button>
            </>
          )}
          <div onClick={handleDebugRedirect}>
            <AppVersion />
          </div>
        </div>
      </div>
    </div>
  )
}
