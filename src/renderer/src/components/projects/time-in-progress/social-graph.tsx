import { differenceInMinutes, format } from 'date-fns'
import { CircleCheck, ServerIcon } from 'lucide-react'

import { type Social } from '@shared/types'

import { Label } from '~/components/ui/label'
import { PingSVG } from '~/components/svg-icons'
import LineChartComponent from '~/components/composed-chart'

import { SocialIndicator, SocialStatsCard } from './social-stats-card'

export function SocialGraph({ title, data }: { title: string; data?: Social }) {
  const followersDiff = data?.data?.followers_difference ?? 0
  const followersCount = data?.data?.latest_followers
  const historyData = data?.history

  const fill =
    followersDiff > 0
      ? 'rgba(0, 255, 200, 0.2)'
      : followersDiff === 0
        ? 'rgba(255, 255, 0, 0.1)'
        : 'rgba(255, 0, 0, 0.1)'

  const currentDate = new Date()

  const fromDate = new Date(String(data?.data?.from_date ?? new Date()))
  const toDate = new Date(String(data?.data?.to_date ?? new Date()))

  const timeDifference = differenceInMinutes(currentDate, fromDate)
  const dataStaleTime = differenceInMinutes(currentDate, toDate)

  const isActive = timeDifference >= 60 ? true : false
  const strokeColor = followersDiff > 0 ? 'lime' : followersDiff === 0 ? 'gray' : 'red'
  const serverIconColor = dataStaleTime >= 10 ? 'lime' : dataStaleTime > 12 ? 'red' : 'grey'

  if (!data) {
    return (
      <div className="flex items-center justify-center border rounded-lg min-h-60 w-full">
        <p>No data..</p>
      </div>
    )
  }

  return (
    <div className="items-center justify-center border rounded-lg min-h-60 w-full">
      <div className="flex flex-nowrap  px-4 border-b justify-between">
        <SocialStatsHeader
          title={title}
          followersDiff={followersDiff}
          followersCount={followersCount}
        />
        <ServerStats
          isActive={isActive}
          fromDate={fromDate}
          dataStaleTime={dataStaleTime}
          serverIconColor={serverIconColor}
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
              toPing={isActive}
              children={<CircleCheck size={14} color={isActive ? 'red' : 'lime'} />}
            />
          </div>
          <div className="flex items-center justify-end gap-2 font-light text-xs">
            <span className="hidden sm:block">
              {fromDate && format(new Date(fromDate), 'dd-MM-yyyy HH:mm')} -
            </span>
            <span>{dataStaleTime} Min</span>
            <PingSVG
              bgColor={serverIconColor === 'lime' ? 'bg-green-400' : 'bg-red-500'}
              toPing={serverIconColor === 'lime' || serverIconColor === 'red'}
              children={<ServerIcon size={14} color={serverIconColor} />}
            />
          </div>
        </div>
      </div>
    </>
  )
}
