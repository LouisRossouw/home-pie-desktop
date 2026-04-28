import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'

import { getAllSearchParams } from '~/libs/utils/search-params'
import { useMrPingPing } from '~/libs/context/mr-ping-ping'

import { ServersAndServicesLayout } from './layout'

export function ServersAndServices() {
  const queryClient = useQueryClient()
  const { getAppRecordedData, getPingPingAppsConfig } = useMrPingPing()

  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const { status, handleGetStatus, getAppStatus } = useMrPingPing()

  // Main Mr Ping Ping service
  const { data: mrPingPingStatus, isPending: isMrPingPingStatusPending } = useQuery({
    queryKey: ['mr-ping-ping-service'],
    queryFn: async () => {
      return await handleGetStatus()
    },
    refetchInterval: 10000 // 10 seconds
  })

  // Fetch all the registered servers / service names
  const { data: registeredServicesRaw, isPending } = useQuery({
    queryKey: ['service-list'],
    queryFn: async () => {
      return await getPingPingAppsConfig()
    }
  })

  const registeredServices = registeredServicesRaw?.data ?? []

  const services = useMemo(() => {
    return registeredServices
      ? registeredServices.map((service) => {
          return service?.slug
        })
      : []
  }, [registeredServices])

  // Other Services.
  const { data: servicesStatus, isPending: isServicesStatusPending } = useQuery({
    queryKey: ['services-status'],
    queryFn: async () => {
      return await getAppStatus({
        appNames: services // TODO; Can we get the services from mr ping ping api or from django
      })
    },
    refetchInterval: 12000,
    enabled: services?.length > 0
  })

  return (
    <ServersAndServicesLayout
      data={servicesStatus ?? []}
      isLoading={isMrPingPingStatusPending || isServicesStatusPending}
      refetch={() => console.log('TODO; Refetch')}
    />
  )
}
