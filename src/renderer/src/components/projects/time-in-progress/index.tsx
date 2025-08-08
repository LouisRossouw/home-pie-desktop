import { useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { ApiTimeInProgressOverview } from '@shared/types'

import { Castle, Edit2, RefreshCcw, Server } from 'lucide-react'

import { getAllSearchParams } from '~/libs/utils/search-params'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { RangeSelector } from '~/components/range-selector'
import { IntervalSelector } from '~/components/interval-selector'
import { LoadingIndicator } from '~/components/loading-indicator'

import { SocialGraph } from './social-graph'

const fiveMin = 1000 * 60 * 5

export function TimeInProgress() {
  const [searchParams] = useSearchParams()

  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 1 // 1 Hour

  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: ['time-in-progress-overview'],
    queryFn: () => getTimeInProgressOverview({ account: 'time.in.progress', range, interval }),
    staleTime: fiveMin,
    refetchInterval: fiveMin
  })

  function handleOpenEditMenu() {
    alert('TODO; Open edit menu or')
    // TODO; Open some kind of edit menu, to edit valuesthat relate to each sociaL media accout.
  }

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p>Loading..</p>
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
          <SocialGraph title={'TikTok'} data={data?.tiktok} />
          <SocialGraph title={'Bluesky'} data={data?.bluesky} />
          {/* <SocialGraph title={'Twitter'} data={data?.twitter} /> */}
        </div>
      </div>
    </div>
  )
}

function ProjectTools({ handleOpenEditMenu }: { handleOpenEditMenu: () => void }) {
  return (
    <>
      <Button variant={'ghost'} size={'icon'} onClick={handleOpenEditMenu}>
        <Edit2 size={18} />
      </Button>
      <Button variant={'ghost'} onClick={handleOpenEditMenu}>
        <Castle size={18} />
      </Button>
    </>
  )
}

async function getTimeInProgressOverview({ account, range, interval }: ApiTimeInProgressOverview) {
  return await window.api.apiTimeInProgressOverview({ account, range, interval })
}
