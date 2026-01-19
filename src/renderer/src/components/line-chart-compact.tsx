import { Area, ComposedChart, Scatter, YAxis, ResponsiveContainer } from 'recharts'

export default function LineChartCompact({ data, followersDifference }) {
  const firstValue = data?.length > 0 ? data[0].followers : 0
  const lastValue = data?.length > 0 ? data[data.length - 1].followers : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  const dotsVisible = true

  const strokeColor = followersDifference > 0 ? 'lime' : followersDifference === 0 ? 'gray' : 'red'

  const fill =
    followersDifference > 0
      ? 'rgba(0, 255, 200, 0.2)'
      : followersDifference === 0
        ? 'rgba(255, 255, 0, 0.1)'
        : 'rgba(255, 0, 0, 0.1)'

  return (
    <>
      <div className="flex w-full h-20 justify-center items-center">
        <ResponsiveContainer width="100%" height={70}>
          <ComposedChart data={data ?? []}>
            <YAxis domain={[minY, maxY]} tick={false} axisLine={false} />
            <Area
              type="monotone"
              dataKey="followers"
              stroke={strokeColor}
              fill={fill}
              activeDot={{ r: 5, stroke: 'red', fill: 'red' }}
              dot={dotsVisible ? { r: 1 } : false}
            />
            <Scatter dataKey="postedAt" fill="aqua" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
