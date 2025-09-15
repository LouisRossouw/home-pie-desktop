import { ResponsiveContainer, ComposedChart, YAxis, XAxis, Area, Scatter, Tooltip } from 'recharts'

export default function TemperatureCompact({ data }) {
  // Pick which metric you want to show
  const key = 'temperature' // or "humidity"

  const firstValue = data?.length > 0 ? data[0][key] : 0
  const lastValue = data?.length > 0 ? data[data.length - 1][key] : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  return (
    <div className="flex w-full h-full justify-center items-center">
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data ?? []}>
          <YAxis domain={[minY, maxY]} tick={false} axisLine={false} />
          <XAxis dataKey="date" hide />
          <Tooltip />
          <Area
            type="monotone"
            dataKey={key}
            stroke="lime"
            fill="rgba(0, 255, 200, 0.2)"
            activeDot={{ r: 5, stroke: 'red', fill: 'red' }}
            dot={{ r: 2 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
