import { useState } from 'react'
import { CircleCheck, ServerIcon } from 'lucide-react'

import { differenceInMinutes, format } from 'date-fns'

import { cn } from '~/libs/utils/cn'
import type { Social } from '@shared/types'

import { Label } from '~/components/ui/label'
import { PingSVG } from '~/components/svg-icons'
import { LoadingIndicator } from '~/components/loading-indicator'
import LineChartComponent from '~/components/projects/time-in-progress/composed-chart'

import { SocialIndicator, SocialStatsCard } from './social-stats-card'
import { AddHistoricalDataDialog } from './add-historical-data-dialog'

export function SocialGraph({
  title,
  data,
  editable,
  ignoreActive
}: {
  title: string
  data?: Social
  editable?: boolean
  ignoreActive?: boolean
}) {
  const [edit, setEdit] = useState(false)

  const platform = data?.data?.platform
  const followersDiff = data?.data?.followersDifference ?? 0
  const followersCount = data?.data?.latestFollowers
  const historyData = data?.historical

  const fill =
    followersDiff > 0
      ? 'rgba(0, 255, 200, 0.2)'
      : followersDiff === 0
        ? 'rgba(255, 255, 0, 0.1)'
        : 'rgba(255, 0, 0, 0.1)'

  const currentDate = new Date()

  const fromDate = new Date(String(data?.data?.fromDate ?? new Date()))
  const toDate = new Date(String(data?.data?.toDate ?? new Date()))

  const timeDifference = differenceInMinutes(currentDate, fromDate)
  const dataStaleTime = differenceInMinutes(currentDate, toDate)

  // ** Re write this better

  const isActive = ignoreActive ? true : timeDifference <= 60 ? true : false
  const strokeColor = followersDiff > 0 ? 'lime' : followersDiff === 0 ? 'gray' : 'red'
  const serverIconColor =
    dataStaleTime >= 10 && dataStaleTime <= 12 ? 'lime' : dataStaleTime > 12 ? 'red' : 'grey'

  const critical = ignoreActive ? false : dataStaleTime > 30

  // **

  function handleEditVisibility(visible: boolean) {
    if (!editable || !platform) return
    setEdit(visible)
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center border rounded-lg min-h-60 w-full">
        <p>No data..</p>
      </div>
    )
  }

  return (
    <>
      <div
        className={cn(
          'relative items-center justify-center   rounded-lg min-h-60 w-full'
          // critical && 'border-accent-foreground/40'
        )}
        onMouseLeave={() => handleEditVisibility(false)}
        onMouseEnter={() => handleEditVisibility(true)}
      >
        {critical && (
          <div className="absolute flex items-center justify-center rounded-lg w-full h-full p-4 z-10 bg-background/80">
            <div className="flex flex-col justify-center items-center">
              <LoadingIndicator />
              <p className="text-xs">{title} is Offline</p>
            </div>
          </div>
        )}
        <div className="flex flex-nowrap  px-4 border-b justify-between">
          <SocialStatsHeader
            title={title}
            followersDiff={followersDiff}
            followersCount={followersCount}
          />
          {edit && (
            <div className="flex items-center">
              <AddHistoricalDataDialog platform={platform} followersCount={followersCount ?? 0} />
            </div>
          )}
          <ServerStats
            isActive={isActive}
            fromDate={fromDate}
            dataStaleTime={dataStaleTime}
            serverIconColor={ignoreActive ? 'gray' : serverIconColor}
          />
        </div>

        <div className="flex h-[calc(100%-45px)] w-full items-center justify-center p-4 text-xs sm:text-sm">
          <LineChartComponent
            dataKey="followers"
            data={historyData}
            fill={fill}
            strokeColor={strokeColor}
          />
        </div>
      </div>
    </>
  )
}

function SocialStatsHeader({ title, followersDiff, followersCount }) {
  return (
    <div className="flex items-center w-full justify-start gap-4">
      <div className="flex justify-center items-center gap-2">
        <Label className="text-lg">{title}</Label>
        <SocialIndicator value={followersDiff} />
      </div>

      <div className="flex border-l min-w-50">
        <SocialStatsCard
          disableIndicator
          title={'Followers'}
          value={followersCount}
          className="border-none shadow-none"
        />
        <SocialStatsCard
          disableIndicator
          title={'Difference'}
          value={followersDiff}
          className="border-none shadow-none"
        />
      </div>
    </div>
  )
}

function ServerStats({ isActive, fromDate, dataStaleTime, serverIconColor }) {
  return (
    <>
      <div className="flex items-center w-3/6">
        <div className=" w-full  gap-4 px-2">
          <div className="flex items-center justify-end gap-2 font-light  text-xs sm:text-sm">
            <span className="hidden sm:block">Active</span>
            <PingSVG
              bgColor="bg-red-400"
              toPing={!isActive}
              children={<CircleCheck size={14} color={isActive ? 'lime' : 'red'} />}
            />
          </div>
          <div className="flex items-center justify-end gap-2 font-light text-xs">
            <span className="hidden sm:block">
              {fromDate && format(new Date(fromDate), 'HH:mm')} -
            </span>
            <span>{dataStaleTime} Min</span>
            <PingSVG
              bgColor={serverIconColor === 'lime' ? 'bg-green-400' : 'bg-red-500'}
              toPing={serverIconColor === 'red'}
              children={<ServerIcon size={14} color={serverIconColor} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}
