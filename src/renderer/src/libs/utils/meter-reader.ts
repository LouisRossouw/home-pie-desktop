import { Schemas } from '@shared/types'

type AppRecordedData = Schemas['AppRecordedData']

export function meterReadStatusData({ data }: { data: AppRecordedData }) {
  if (!data) return undefined

  const item = data[0]
  const electricityEndpoint = item.endpointsRes.find((e: any) => e.endpoint === 'electricity')

  return {
    kwh: electricityEndpoint?.response?.data?.kwh,
    dateTime: item.dateTime
  }
}
