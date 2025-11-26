import { useMemo, useRef } from 'react'
import { useLocation } from 'react-router'

import { Bug, House, Star } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'

import { settingKeys } from '@shared/default-app-settings'

import { cn } from '~/libs/utils/cn'
import { useApp } from '~/libs/context/app'
import { useNav } from '~/libs/hooks/use-navigation'
import { useMrPingPing } from '~/libs/context/mr-ping-ping'
import { meterReadStatusData } from '~/libs/utils/meter-reader'
import { calculateRenderTime } from '~/libs/hooks/use-render-timer'
import { formatDHT11SensorHistoricData } from '~/libs/utils/mr-ping-ping'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'

import { Button } from './ui/button'
import { AppVersion } from './app-version'
import { MrPingPingIndicator } from './mr-ping-ping'
import { TemperatureHumidity } from './temperature-humidity'

const tenMin = 1000 * 60 * 10

export function WindowFrameDebug() {
  const countToDebug = useRef(0)
  const { pathname } = useLocation()
  const { navigateTo } = useNav()
  const { status } = useMrPingPing()

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
    <div className="flex items-center justify-between h-8 px-4 rounded-b-lg border-t bg-background">
      <div className="grid grid-cols-5 w-full">
        <div className="flex col-span-1 gap-4 justify-start items-center">
          <Button
            variant={'ghost'}
            className="w-6 h-6"
            // disabled={isStartRoute}
            onClick={() => {
              if (isStartRoute) return
              updateUserSettings([{ setting: settingKeys.startRoute, value: pathname }])
            }}
          >
            <Star size={18} className={cn(isStartRoute && 'text-accent')} />
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

          {appSettings?.debug && <p className="text-xs">{pathname}</p>}
        </div>
        <div className="flex col-span-3 justify-center items-center gap-4">
          <TempHumStats />
          <PowerStats />
        </div>

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
          <div onClick={handleDebugRedirect}>
            <AppVersion />
          </div>
        </div>
      </div>
    </div>
  )
}

function PowerStats() {
  const { getAppStatus } = useMrPingPingService()

  const { data: meterReadRaw, isPending } = useQuery({
    queryKey: ['meter-read-stat'],
    queryFn: async () => {
      return await getAppStatus({
        appNames: ['meter_reader_api']
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  const electricityData = useMemo(() => {
    return meterReadStatusData({ data: meterReadRaw })
  }, [meterReadRaw])

  return (
    <div className="flex items-center justify-center w-full gap-2">
      <>
        {electricityData && (
          <div className="flex items-center gap-1">
            <p className="text-xs">⚡kWh:</p>
            <p className="text-xs">{electricityData.kwh}</p>
          </div>
        )}
      </>
    </div>
  )
}

function TempHumStats() {
  const { getAppRecordedData } = useMrPingPingService()

  const interval = 3
  const range = 'hour'

  const { data: tempDataUpstairsRaw, isPending } = useQuery({
    queryKey: ['temperature-humidity'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity'],
        interval,
        range
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  const { data: tempDataDownStairsRaw, isPending: isTempDownStairsPending } = useQuery({
    queryKey: ['temperature-humidity-down-stairs'],
    queryFn: async () => {
      return await getAppRecordedData({
        appNames: ['temperature_humidity_02'],
        interval,
        range
      })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  const { tempDataUpstairs, tempDataDownstairs } = useMemo(() => {
    return {
      tempDataUpstairs: formatDHT11SensorHistoricData({ data: tempDataUpstairsRaw }),
      tempDataDownstairs: formatDHT11SensorHistoricData({ data: tempDataDownStairsRaw })
    }
  }, [tempDataUpstairsRaw, tempDataDownStairsRaw])

  const diffTemp = (tempDataUpstairs?.temperature - tempDataDownstairs?.temperature)
    .toFixed(1)
    .replace('-', '')

  const diffHumid = (tempDataUpstairs?.humidity - tempDataDownstairs?.humidity)
    .toFixed(1)
    .replace('-', '')

  return (
    <div className="flex items-center justify-center w-full gap-2">
      <>
        {tempDataDownstairs && (
          <TemperatureHumidity
            label="TV:"
            data={tempDataDownstairs}
            isLoading={isTempDownStairsPending}
          />
        )}

        {tempDataUpstairs && (
          <TemperatureHumidity label="PC:" data={tempDataUpstairs} isLoading={isPending} />
        )}

        {tempDataDownstairs && tempDataUpstairs && (
          <div className="flex items-center gap-1">
            <p className="text-xs">Diff:</p>
            <p className="text-xs">{diffTemp} °C /</p>
            <p className="text-xs">{diffHumid} %</p>
          </div>
        )}
      </>
    </div>
  )
}
