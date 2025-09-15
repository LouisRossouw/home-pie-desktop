import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { ApiTimeInProgressOverview } from '@shared/types'

import { Castle, CircleCheck, Edit2, InspectIcon, RefreshCcw, Server } from 'lucide-react'

import { useNav } from '~/libs/hooks/use-navigation'
import { getAllSearchParams } from '~/libs/utils/search-params'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { TooltipInfo } from '~/components/tooltip-info'
import { RangeSelector } from '~/components/range-selector'
import { IntervalSelector } from '~/components/interval-selector'
import { LoadingIndicator } from '~/components/loading-indicator'

import { SocialGraph } from './social-graph'
import { useMrPingPingService } from '~/libs/hooks/use-mr-ping-ping-service'
import { addHours, differenceInMinutes } from 'date-fns'
import { PingSVG } from '~/components/svg-icons'

const fiveMin = 1000 * 60 * 5
const tenMin = 1000 * 60 * 10

export function TimeInProgress() {
  const [searchParams] = useSearchParams()
  const { getAppStatus } = useMrPingPingService()

  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 1 // 1 Hour

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['time-in-progress-overview'],
    queryFn: () => getTimeInProgressOverview({ account: 'time.in.progress', range, interval }),
    refetchInterval: fiveMin,
    staleTime: fiveMin
  })

  // Return the status of the client, and API for time in progress.
  const { data: systemData } = useQuery({
    queryKey: ['system-status', 'time-in-progress'],
    queryFn: async () => {
      return await getAppStatus({ appNames: ['timeinprogress_client', 'timeinprogress_api'] })
    },
    refetchInterval: tenMin,
    staleTime: tenMin
  })

  function handleOpenEditMenu() {
    alert('TODO; Open edit menu or')
    // TODO; Open some kind of edit menu, to edit valuesthat relate to each sociaL media accout.
  }

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!isPending && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p>Something went wrong..</p>
      </div>
    )
  }

  const dbTime = data?.db_elapsed_time

  return (
    <div className="flex w-full h-[calc(100vh-160px)] items-center justify-center animate-in fade-in duration-800 ease-in-out">
      <div className="h-full w-full p-4 space-y-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex items-center gap-2">
            <Label className="text-lg text-bold text-foreground">Time In Progress</Label>
            <SystemStatus systemData={systemData ?? []} />
            <Button variant={'ghost'} size={'icon'} onClick={handleOpenEditMenu}>
              <Edit2 size={18} />
            </Button>
            <ProjectTools handleOpenEditMenu={handleOpenEditMenu} />
          </div>

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
        </div>
        <div className="grid h-full w-full gap-4 overflow-y-scroll grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
          <SocialGraph title={'Instagram'} data={data?.instagram} />
          <SocialGraph title={'YouTube'} data={data?.youtube} />
          <SocialGraph title={'TikTok'} data={data?.tiktok} editable ignoreActive />
          <SocialGraph title={'Bluesky'} data={data?.bluesky} />
          {/* <SocialGraph title={'Twitter'} data={data?.twitter} /> */}
        </div>
      </div>
    </div>
  )
}

function SystemStatus({ systemData }: { systemData: any[] }) {
  return (
    <div className="flex px-2 gap-2">
      {systemData?.map((data) => {
        const critical = data?.success ? false : true

        const lastPingedMin = differenceInMinutes(new Date(), addHours(data?.date_time, 2))
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
            {data.appName === 'timeinprogress_client' && <p className="text-xs">CLI</p>}
            {data.appName === 'timeinprogress_api' && <p className="text-xs">API</p>}
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

async function getTimeInProgressOverview({ account, range, interval }: ApiTimeInProgressOverview) {
  return await window.api.external.apiTimeInProgressOverview({ account, range, interval })
}
