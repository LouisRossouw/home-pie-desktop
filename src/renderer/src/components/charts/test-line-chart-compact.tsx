import { format } from 'date-fns'
import {
  Area,
  ComposedChart,
  Scatter,
  YAxis,
  ResponsiveContainer,
  XAxis,
  TooltipProps,
  Tooltip
} from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export function EnerygyRemainingKwhChart({ data }) {
  const firstValue = data?.length > 0 ? data[0].kwh : 0
  const lastValue = data?.length > 0 ? data[data.length - 1].kwh : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  const dotsVisible = true

  const strokeColor = 'yellow'

  return (
    <>
      <div className="flex w-full h-20 justify-center items-center">
        <ResponsiveContainer width="100%" height={70}>
          <ComposedChart data={data ?? []}>
            {data && (
              <XAxis
                fontSize={12}
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), 'HH:mm')}
              />
            )}
            <YAxis domain={[minY, maxY]} tick={false} axisLine={false} />
            {data && (
              <Tooltip content={<EnergyRemaininigTooltip />} cursor={{ fill: 'transparent' }} />
            )}

            <Area
              type="monotone"
              dataKey="kwh"
              stroke={strokeColor}
              fill={'rgba(200, 200, 20, 0.2)'}
              activeDot={{ r: 5, stroke: 'red', fill: 'red' }}
              dot={dotsVisible ? { r: 2 } : false}
            />

            <Scatter dataKey="postedAt" fill="aqua" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}

export function EnergyBurnKwhChart({ data }) {
  const firstValue = data?.length > 0 ? data[0].used : 0
  const lastValue = data?.length > 0 ? data[data.length - 1].used : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  const dotsVisible = true

  return (
    <div className="flex w-full h-full justify-center items-center">
      <ResponsiveContainer width="100%" height={70}>
        <ComposedChart data={data ?? []}>
          {data && (
            <XAxis
              fontSize={12}
              dataKey="from"
              tickFormatter={(date) => format(new Date(date), 'HH:mm')}
            />
          )}
          <YAxis domain={[minY, maxY]} tick={false} axisLine={false} />
          {data && <Tooltip content={<BurnRateTooltip />} cursor={{ fill: 'transparent' }} />}

          <Area
            type="monotone"
            dataKey="used"
            stroke={'red'}
            fill={'rgba(255, 150, 200, 0.2)'}
            activeDot={{ r: 5, stroke: 'red', fill: 'red' }}
            dot={dotsVisible ? { r: 2 } : false}
          />
          <Scatter
            dataKey="kwhPerHour"
            fill="rgba(255, 255, 255, 0.4)"
            shape={(props) => (
              <circle cx={props.cx} cy={props.cy} r={2} fill="rgba(255,255,255,0.6)" />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnergyRemaininigTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 rounded text-xs">
        <p>{format(new Date(label as string), 'yyyy-MM-dd HH:mm')}</p>
        <p>⚡kwh: {payload.find((p) => p.dataKey === 'kwh')?.value.toFixed(2) ?? 'N/A'}</p>
      </div>
    )
  }

  return null
}

const BurnRateTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background p-2 rounded text-xs">
        <p>{format(new Date(label as string), 'yyyy-MM-dd HH:mm')}</p>
        <p>⚡kwh/H: {payload.find((p) => p.dataKey === 'kwhPerHour')?.value.toFixed(2) ?? 'N/A'}</p>
        <p>🔥used: {payload.find((p) => p.dataKey === 'used')?.value.toFixed(2) ?? 'N/A'}</p>
      </div>
    )
  }

  return null
}
