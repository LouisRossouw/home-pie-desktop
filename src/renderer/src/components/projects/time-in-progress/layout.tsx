import { Outlet, useLocation } from 'react-router'
import { addHours, differenceInMinutes } from 'date-fns'

import { Range } from '@shared/types'

import { Castle, CircleCheck, InspectIcon, RefreshCcw, Server } from 'lucide-react'

import { useNav } from '~/libs/hooks/use-navigation'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { TooltipInfo } from '~/components/tooltip-info'
import { RangeSelector } from '~/components/range-selector'
import { IntervalSelector } from '~/components/interval-selector'
import { LoadingIndicator } from '~/components/loading-indicator'

import { PingSVG } from '~/components/svg-icons'
import { ProjectMenuDropdown } from '~/components/project-menu'

export function TimeInProgressLayout({
  data,
  systemData,
  isFetching,
  range,
  interval,
  refetch,
  dbTime
}: {
  data: any
  systemData: any
  isFetching: boolean
  isPending: boolean
  interval: number
  refetch: () => void
  dbTime: number
  range: Range
}) {
  const { pathname } = useLocation()

  return (
    <div className="flex w-full h-[calc(100vh-165px)] items-center justify-center animate-in fade-in duration-800 ease-in-out">
      <div className="h-full w-full p-4 space-y-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <Label className="text-lg text-bold text-foreground">Time In Progress</Label>
            <SystemStatus systemData={systemData ?? []} />

            <ProjectMenuDropdown />
            <ProjectTools handleOpenEditMenu={() => alert('todo')} />
          </div>

          {/* *** This condition is weird */}
          {!pathname.includes('config') && (
            <div className="flex gap-4 items-center">
              <RangeSelector selected={range} />
              <IntervalSelector currentValue={interval} className="w-32" />
              {dbTime && (
                <div className="flex gap-2 text-xs">
                  <Server size={14} />
                  <p>{dbTime.toFixed(2)}</p>
                </div>
              )}
              <Button variant={'outline'} size={'icon'} onClick={() => refetch()}>
                {isFetching ? <LoadingIndicator /> : <RefreshCcw />}
              </Button>
            </div>
          )}
        </div>
        <Outlet context={{ data }} />
      </div>
    </div>
  )
}

function SystemStatus({ systemData }: { systemData: any[] }) {
  return (
    <div className="flex px-2 gap-2">
      {systemData?.map((data) => {
        const critical = data?.success ? false : true

        const lastPingedMin = differenceInMinutes(new Date(), addHours(data?.dateTime, 2))
        const serverIconColor = critical
          ? 'red'
          : lastPingedMin <= 45
            ? 'lime'
            : lastPingedMin > 60
              ? 'red'
              : 'grey'

        return (
          <div>
            <PingSVG
              toPing={serverIconColor === 'red'}
              bgColor={serverIconColor === 'lime' ? 'bg-green-400' : 'bg-red-500'}
              children={<CircleCheck size={14} color={serverIconColor} />}
            />
            {data?.appName === 'timeinprogress_client' && <p className="text-xs">CLI</p>}
            {data?.appName === 'timeinprogress_api' && <p className="text-xs">API</p>}
          </div>
        )
      })}
    </div>
  )
}

function ProjectTools({ handleOpenEditMenu }: { handleOpenEditMenu: () => void }) {
  const { navigateTo } = useNav()

  return (
    <>
      <TooltipInfo
        content="GenGen"
        children={
          <Button variant={'outline'} onClick={() => navigateTo('/gengen/time-in-progress')}>
            <Castle size={18} />
          </Button>
        }
      />
      <TooltipInfo
        content="Insta Insights"
        children={
          <Button
            variant={'outline'}
            onClick={() => navigateTo('/projects/insta-insights/time.in.progress/insights')}
          >
            <InspectIcon size={18} />
          </Button>
        }
      />
    </>
  )
}
