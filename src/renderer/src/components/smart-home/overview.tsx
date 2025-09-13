import { useOutletContext } from 'react-router'
import { Button } from '../ui/button'
import { LoadingIndicator } from '../loading-indicator'
import { useMemo } from 'react'
import TemperatureCompact from '../temperature-chart'
import TempHumidComponent from '../temp-humid-chart'

// TODO; Show an overview of all on mr ping pings status, and the status of the projects it monitors.

export function SmartHomeOverview() {
  const { data, isLoading, refetch } = useOutletContext<any>()

  // const reshapeData = useMemo(() => {
  //   const app = data[0]

  //   return app.app_status.map((status) => {
  //     const temperature = status.endpoints_res.find((e) => e.endpoint === 'temperature')?.response.data?.temperature ?? null
  //     const humidity = status.endpoints_res.find((e) => e.endpoint === 'humidity')?.response.data?.humidity ?? null

  //     return {
  //       date: status.date,
  //       data: {
  //         temperature,
  //         humidity
  //       }
  //     }
  //   })
  // }, [data])

  const reshapeData = useMemo(() => {
    if (!data) return []

    return data[0].app_status.map((status) => ({
      date: status.date,
      temperature:
        status.endpoints_res.find((e) => e.endpoint === 'temperature')?.response.data
          ?.temperature ?? null,
      humidity:
        status.endpoints_res.find((e) => e.endpoint === 'humidity')?.response.data?.humidity ?? null
    }))
  }, [data])

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-96px)] items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <div className="text-center gap-4 w-full h-full">
        <Button className="w-20" onClick={refetch}>
          Reload
        </Button>
        {/* <h2>Smart Home overview route</h2> */}
        {/* {JSON.stringify(reshapeData, null, 2)} */}
        <div className="w-full h-full p-4 pb-12">
          <TempHumidComponent data={reshapeData} />
        </div>
      </div>
    </div>
  )
}

// ;[
//   {
//     appName: 'temperature_humidity',
//     app_status: [
//       {
//         date: '2025-09-12 20:39:30.629172',
//         endpoints_res: [
//           {
//             endpoint: 'temperature',
//             full_url: 'http://10.0.0.153/temperature',
//             res_time: 10.014613628387451,
//             response: { code: 500, success: false, data: null }
//           },
//           {
//             endpoint: 'humidity',
//             full_url: 'http://10.0.0.153/humidity',
//             res_time: 10.012178182601929,
//             response: { code: 500, success: false, data: null }
//           }
//         ]
//       }
//     ]
//   }
// ]
