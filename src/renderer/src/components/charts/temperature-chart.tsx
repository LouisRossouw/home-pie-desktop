import { format } from 'date-fns'
import {
  Area,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

import { Range } from '@shared/types'

type ChartData = {
  date: string
  temperature?: number | null
  humidity?: number | null
  temperature_pc?: number | null
  humidity_pc?: number | null
  temperature_tv?: number | null
  humidity_tv?: number | null
}

export default function TemperatureChart({
  data,
  range,
  temperatureColour
}: {
  data: ChartData[]
  range?: Range
  temperatureColour?: { stroke: string; fill: string }
}) {
  const values = data
    .flatMap((d) => [
      d.temperature ?? undefined,
      d.temperature_pc ?? undefined,
      d.temperature_tv ?? undefined
    ])
    .filter((v) => v !== undefined) as number[]

  const minY = values.length > 0 ? Math.floor(Math.min(...values) - 2) : 0
  const maxY = values.length > 0 ? Math.ceil(Math.max(...values) + 2) : 40

  const dotsVisible = true

  const formatTick = (dateStr: string) => {
    const date = new Date(dateStr)
    if (range && ['week', 'month', 'year'].includes(range)) {
      return format(date, 'MM-dd HH:mm')
    }
    if (range === 'day') {
      return format(date, 'HH:mm')
    }
    return format(date, 'HH:mm')
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data ?? []} className="text-xs">
        <CartesianGrid stroke="#ccc" opacity={0.2} />
        {data && <XAxis dataKey="date" tickFormatter={formatTick} minTickGap={30} />}
        <YAxis domain={[minY, maxY]} width={30} />
        {data && <Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />}

        <Legend />

        {/* Single Room Temperature */}
        <Area
          type="monotone"
          dataKey="temperature"
          stroke={temperatureColour?.stroke ?? '#00f2ff'}
          fill={temperatureColour?.fill ?? 'rgba(0, 242, 255, 0.1)'}
          activeDot={{ r: 5, stroke: 'white', fill: 'red' }}
          dot={dotsVisible ? { r: 2 } : false}
          name="Temperature (°C)"
          connectNulls
          legendType="none"
        />

        {/* PC Room Temperature */}
        <Area
          type="monotone"
          dataKey="temperature_pc"
          stroke="#00f2ff"
          fill="rgba(0, 242, 255, 0.1)"
          activeDot={{ r: 5, stroke: 'white' }}
          dot={dotsVisible ? { r: 2 } : false}
          name="PC Room (°C)"
          connectNulls
        />

        {/* TV Room Temperature */}
        <Area
          type="monotone"
          dataKey="temperature_tv"
          stroke="#ff00ea"
          fill="rgba(255, 0, 234, 0.1)"
          activeDot={{ r: 5, stroke: 'white' }}
          dot={dotsVisible ? { r: 2 } : false}
          name="TV Room (°C)"
          connectNulls
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-sm text-white p-3 rounded-lg text-xs shadow-xl border border-white/10">
        <p className="border-b border-white/20 pb-1 mb-2 font-bold">
          {format(new Date(label as string), 'yyyy-MM-dd HH:mm')}
        </p>
        <div className="space-y-1">
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              ● {p.name}: {p.value}
            </p>
          ))}
        </div>
      </div>
    )
  }

  return null
}
