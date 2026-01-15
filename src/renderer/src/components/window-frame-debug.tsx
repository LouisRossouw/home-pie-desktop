import { useRef } from 'react'
import { useLocation } from 'react-router'

import { Bug, House, Star } from 'lucide-react'
import { settingKeys } from '@shared/default-app-settings'

import { cn } from '~/libs/utils/cn'
import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { useMrPingPing } from '~/libs/context/mr-ping-ping'
import { calculateRenderTime } from '~/libs/hooks/use-render-timer'

import { Button } from './ui/button'
import { AppVersion } from './app-version'
import { MrPingPingIndicator } from './mr-ping-ping'
import { PowerStats } from './power-stats'
import { TempHumStats } from './temperature-humidity-status'

export function WindowFrameDebug() {
  const { pathname } = useLocation()
  const { status } = useMrPingPing()
  const { navigateTo } = useNav()

  const countToDebug = useRef(0)

  const { userSettings, appSettings, updateAppSettings, updateUserSettings, startRenderTime } =
    useApp()

  function handleDebugRedirect() {
    countToDebug.current += 1

    if (countToDebug.current >= 5) {
      countToDebug.current = 0
      navigateTo('debug')
      updateAppSettings([{ setting: settingKeys.debug, value: true }])
    }
  }

  const isLogin = pathname === '/login'
  const isStartRoute = userSettings?.startRoute === pathname

  if (isLogin) {
    return (
      <div className="flex items-center justify-between h-8 px-4 rounded-b-lg  bg-background"></div>
    )
  }

  const duration = calculateRenderTime(startRenderTime.current)

  const startRoute = userSettings?.startRoute as string | undefined

  return (
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg bg-background">
      <div className="flex w-full justify-between">
        <div className="flex col-span-1 gap-4 justify-start items-center w-full">
          <Button
            variant={'ghost'}
            className="w-6 h-6"
            // disabled={isStartRoute}
            onClick={() => {
              if (isStartRoute) return
              updateUserSettings([{ setting: settingKeys.startRoute, value: pathname }])
            }}
          >
            <Star size={18} className={cn(isStartRoute && 'text-accent-foreground')} />
          </Button>
          {startRoute && (
            <Button
              variant={'ghost'}
              className="w-6 h-6"
              onClick={() => navigateTo(startRoute ?? '/')}
            >
              <House size={18} />
            </Button>
          )}

          {appSettings?.debug && <p className="text-xs opacity-50">{pathname}</p>}
        </div>
        <div className="flex w-full justify-end items-center gap-4 px-4">
          <TempHumStats />
          <PowerStats />
        </div>
        {/* <div className="flex col-span-1 justify-center items-center gap-4"></div> */}

        <div className="flex col-span-1 justify-end items-center gap-4">
          <MrPingPingIndicator
            resTime={status?.resTime}
            lastPingedRaw={status?.lastPinged}
            isLoading={status?.lastPinged ? false : true}
          />
          {appSettings?.debug && (
            <>
              <p className="text-xs">{`${duration.toFixed(2)}ms`}</p>
              <Button variant={'outline'} className="w-6 h-6" onClick={() => navigateTo('debug')}>
                <Bug />
              </Button>
            </>
          )}
          <div className="text-right w-18" onClick={handleDebugRedirect}>
            <AppVersion />
          </div>
        </div>
      </div>
    </div>
  )
}
