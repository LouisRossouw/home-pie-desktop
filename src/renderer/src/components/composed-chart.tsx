import { format } from 'date-fns'
import { Area, ComposedChart, Scatter, TooltipProps } from 'recharts'
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function LineChartComponent({ dataKey, data, strokeColor, fill }) {
  const firstValue = data?.length > 0 ? data[0].followers : 0
  const lastValue = data?.length > 0 ? data[data.length - 1].followers : 0

  const minY = Math.min(firstValue, lastValue)
  const maxY = Math.max(firstValue, lastValue)

  const dotsVisible = true

  // TODO: Format date key

  return (
    // <div className="flex w-full h-full justify-center items-center">
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart data={data ?? []} className="text-xs">
        <CartesianGrid stroke="#ccc" opacity={0.2} />
        {data && <XAxis dataKey={'date'} tickFormatter={(date) => format(date, 'yyyy-MM-dd')} />}
        <YAxis domain={[minY, maxY]} width={5} />
        {data && (
          <Tooltip content={<CustomTooltip data={data} />} cursor={{ fill: 'transparent' }} />
        )}

        <Legend />
        <Area
          fill={fill}
          type="bump"
          dataKey={dataKey}
          stroke={strokeColor}
          activeDot={{ r: 5, stroke: 'white', fill: 'red' }}
          dot={dotsVisible ? { r: 2 } : false}
        />
        <Scatter dataKey="postedAt" fill="aqua" />
      </ComposedChart>
    </ResponsiveContainer>
    // </div>
  )
}

const CustomTooltip = ({ active, payload, label, data }: TooltipProps<ValueType, NameType>) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        {/* <p className="desc">{`Posts: ${data[label]?.post ?? 'N/A'}`}</p> */}
        <p className="label">{`Followers ${payload?.[0]?.value ?? 'N/A'}`}</p>
        {/* <p className="desc">{format(data[label]?.date ?? '2025-01-01', 'dd-MM-yyyy HH:mm')}</p> */}
      </div>
    )
  }

  return null
}
