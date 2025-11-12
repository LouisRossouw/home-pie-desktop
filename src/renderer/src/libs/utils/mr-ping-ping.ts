import { Schemas } from '@shared/types'

type AppRecordedData = Schemas['AppRecordedData']

// User with getAppStatus from useMrPingPingService() // No historic data
export function formatDHT11SensorStatusData({ data }: { data: AppRecordedData }) {
  if (!data) return undefined

  const item = data[0]
  const tempEndpoint = item.endpointsRes.find((e: any) => e.endpoint === 'temperature')
  const humidityEndpoint = item.endpointsRes.find((e: any) => e.endpoint === 'humidity')

  return {
    temperature: tempEndpoint?.response?.data?.temperature,
    humidity: humidityEndpoint?.response?.data?.humidity,
    datetime: item.dateTime
  }
}

// Used with getAppRecordedData from useMrPingPingService() // Has historic data
export function formatDHT11SensorHistoricData({ data }: { data: any }) {
  if (!data?.length) return undefined

  const item = data[0]

  // Filter valid temperature readings
  const validTemps = item?.appStatus
    .map((s: any) => {
      const tempEndpoint = s.endpointsRes.find((e: any) => e.endpoint === 'temperature')
      return tempEndpoint?.response?.code === 200
        ? { temperature: tempEndpoint.response.data.temperature, date: s.date }
        : null
    })
    .filter(Boolean)
    .slice(-3) // take last 6 valid readings

  // Filter valid humidity readings
  const validHumidity = item?.appStatus
    .map((s: any) => {
      const humidityEndpoint = s.endpointsRes.find((e: any) => e.endpoint === 'humidity')
      return humidityEndpoint?.response?.code === 200
        ? { humidity: humidityEndpoint.response.data.humidity, date: s.date }
        : null
    })
    .filter(Boolean)
    .slice(-3)

  if (!validTemps?.length && !validHumidity?.length) return undefined

  // Temperature trend
  const latestTemp = validTemps.at(-1)
  const firstTemp = validTemps[0]
  const tempTrend =
    latestTemp?.temperature > firstTemp?.temperature
      ? 'up'
      : latestTemp?.temperature < firstTemp?.temperature
        ? 'down'
        : 'stable'

  // Humidity trend
  const latestHum = validHumidity.at(-1)
  const firstHum = validHumidity[0]
  const humTrend =
    latestHum?.humidity > firstHum?.humidity
      ? 'up'
      : latestHum?.humidity < firstHum?.humidity
        ? 'down'
        : 'stable'

  return {
    temperature: latestTemp?.temperature,
    humidity: latestHum?.humidity,
    temperatureTrend: tempTrend,
    humidityTrend: humTrend,
    temperatureHistory: validTemps,
    humidityHistory: validHumidity,
    dateTime: latestTemp?.date // or latestHum.date, depending on what you want to display
  }
}
