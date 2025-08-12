import { format } from 'date-fns'
import { Area, ComposedChart, LineChart, Scatter, TooltipProps } from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LineChartCompact({ data, followers_difference }) {
  const firstValue = data?.length > 0 ? data[0].followers : 0
  const lastValue = data?.length > 0 ? data[data.length - 1].followers : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  const dotsVisible = true

  return (
    <>
      <div className="flex w-full h-full justify-center items-center">
        <ResponsiveContainer width="100%" height={100}>
          <ComposedChart data={data ?? []}>
            <YAxis domain={[minY, maxY]} tick={false} axisLine={false} />
            <Area
              type="monotone"
              dataKey="followers"
              stroke={
                followers_difference > 0 ? 'lime' : followers_difference === 0 ? 'yellow' : 'red'
              }
              fill={
                followers_difference > 0
                  ? 'rgba(0, 255, 200, 0.2)'
                  : followers_difference === 0
                    ? 'rgba(255, 255, 0, 0.1)'
                    : 'rgba(255, 0, 0, 0.1)'
              }
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
