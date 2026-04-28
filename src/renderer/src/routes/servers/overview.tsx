import { useQuery } from '@tanstack/react-query'
import { ServersAndServicesOverview } from '~/components/servers/overview'
import { useMrPingPing } from '~/libs/context/mr-ping-ping'

export default function ServersOverviewRoute() {
  return <ServersAndServicesOverview />
}

// export default function ServersOverviewRoute() {
//   const { status, handleGetStatus, getAppStatus } = useMrPingPing()

//   // Main Mr Ping Ping service
//   const { data: mrPingPingStatus, isPending: isMrPingPingStatusPending } = useQuery({
//     queryKey: ['mr-ping-ping-service'],
//     queryFn: async () => {
//       return await handleGetStatus()
//     },
//     refetchInterval: 10000 // 10 seconds
//   })

//   // Other Services.
//   const { data: servicesStatus, isPending: isServicesStatusPending } = useQuery({
//     queryKey: ['services-status'],
//     queryFn: async () => {
//       return await getAppStatus({
//         appNames: [...localServices, ...cloudServers]
//       })
//     },
//     refetchInterval: 12000
//   })
//   console.log('-------')
//   console.log('mrPingPingStatus:')
//   console.log(mrPingPingStatus)
//   console.log('-------')

//   console.log('-------')
//   console.log('servicesStatus:')
//   console.log(servicesStatus)
//   console.log('-------')

//   return (
//     <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center">
//       <div className="text-center">
//         <h2>Overview</h2>
//         <p className="text-xs">* To show an overview of all my servers *</p>

//         {JSON.stringify(mrPingPingStatus, null, 2)}
//       </div>
//     </div>
//   )
// }
