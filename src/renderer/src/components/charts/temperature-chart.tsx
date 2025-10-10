import { format } from 'date-fns'
import {
  Area,
  ComposedChart,
  Scatter,
  TooltipProps,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'

type ChartData = {
  date: string
  temperature: number | null
  humidity: number | null
}

export default function TemperatureChart({ data }: { data: ChartData[] }) {
  // Compute min/max dynamically for both temperature + humidity
  // const values = data.flatMap((d) => [d.temperature ?? 0, d.humidity ?? 0])
  // const minY = Math.min(...values)
  // const maxY = Math.max(...values)

  const key = 'temperature' // or "humidity"

  const firstValue = data?.length > 0 ? data[0][key] : 0
  const lastValue = data?.length > 0 ? data[data.length - 1][key] : 0

  const minY = Math.min(firstValue! - 5, lastValue! + 5)
  const maxY = Math.max(firstValue! - 5, lastValue! + 5)

  const dotsVisible = true

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data ?? []} className="text-xs">
        <CartesianGrid stroke="#ccc" opacity={0.2} />
        {data && (
          // <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'MM-dd HH:mm')} />
          <XAxis dataKey="date" tickFormatter={(date) => format(new Date(date), 'HH:mm')} />
        )}
        <YAxis domain={[minY, maxY]} width={30} />
        {data && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />}

        <Legend />

        {/* Temperature line/area */}
        <Area
          type="monotone"
          dataKey="temperature"
          stroke="lime"
          fill="rgba(0, 255, 200, 0.2)"
          activeDot={{ r: 5, stroke: 'white', fill: 'red' }}
          dot={dotsVisible ? { r: 2 } : false}
          name="Temperature (°C)"
        />

        {/* Humidity line/area */}
        {/* <Area
          type="monotone"
          dataKey="humidity"
          stroke="blue"
          fill="rgba(0, 0, 255, 0.1)"
          activeDot={{ r: 5, stroke: 'white', fill: 'blue' }}
          dot={dotsVisible ? { r: 2 } : false}
          name="Humidity (%)"
        /> */}

        <Scatter dataKey="postedAt" fill="aqua" />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black text-white p-2 rounded text-xs">
        <p>{format(new Date(label as string), 'yyyy-MM-dd HH:mm')}</p>
        <p>🌡 Temp: {payload.find((p) => p.dataKey === 'temperature')?.value ?? 'N/A'} °C</p>
        <p>💧 Humidity: {payload.find((p) => p.dataKey === 'humidity')?.value ?? 'N/A'} %</p>
      </div>
    )
  }

  return null
}
