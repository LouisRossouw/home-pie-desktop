import { useMemo } from 'react'
import { Network } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { addHours, format } from 'date-fns'

import { Button } from './ui/button'
import { PingSVG } from './svg-icons'
import { TooltipInfo } from './tooltip-info'

import { useMrPingPing } from '~/libs/context/mr-ping-ping'

const oneMin = 1000 * 60 * 1

export function TailNetStats() {
  const navigateTo = useNavigate()
  const { getAppStatus } = useMrPingPing()

  const { data, isPending } = useQuery({
    queryKey: ['tailnet-nodes'],
    queryFn: async () => {
      return await getAppStatus({
        appNames: ['headscale']
      })
    },
    refetchInterval: oneMin
  })

  const { health, nodes } = useMemo(() => {
    if (isPending || !data) return { health: undefined, nodes: [] }

    const res = data[0]?.endpointsRes
    return {
      health: res[0]?.response?.data?.databaseConnectivity,
      nodes: res[1]?.response?.data?.nodes
    }
  }, [data, isPending])

  const activeNodes = useMemo(() => {
    const active = [] as any

    nodes?.forEach((n) => {
      if (n.online) {
        active.push(n)
      }
    })
    return active
  }, [nodes])

  const totalNodesCount = nodes.length
  const totalActiveNodesCount = activeNodes.length

  const formattedDateHours = data && data[0] ? addHours(data[0]?.dateTime, 2) : undefined
  const formattedDate = formattedDateHours ? format(formattedDateHours, 'yyyy-MM-dd HH:mm') : '-'

  if (isPending) return null

  return (
    <TooltipInfo
      content={`Recorded: ${formattedDate}`}
      children={
        <Button
          size={'sm'}
          variant={'ghost'}
          className="h-6 gap-0"
          onClick={() => navigateTo('/tailnet')}
        >
          <div className="flex items-center gap-1">
            <PingSVG
              toPing={!health}
              bgColor={true ? 'bg-red-500' : undefined}
              children={<Network size={12} color={health ? 'lime' : 'red'} />}
            />

            <p className="text-xs">
              {totalActiveNodesCount}/{totalNodesCount}
            </p>
          </div>
        </Button>
      }
    />
  )
}
