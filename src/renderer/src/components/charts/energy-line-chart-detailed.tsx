import { format } from 'date-fns'
import {
  Area,
  YAxis,
  XAxis,
  Tooltip,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts'

export function EnerygyRemainingKwhChartDetailed({
  data
}: {
  data: { kwh: number; date: string }[]
}): JSX.Element {
  const minY = Math.min(...(data?.map((d) => d.kwh) || [0])) * 0.99
  const maxY = Math.max(...(data?.map((d) => d.kwh) || [0])) * 1.01

  return (
    <div className="flex w-full h-full justify-center items-center p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="gradientRemainingDetailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            domain={[minY, maxY]}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(1)}`}
            dx={-10}
          />
          <Tooltip
            content={<EnergyDetailedTooltip unit="kWh" color="#fbbf24" />}
            cursor={{ stroke: '#fbbf24', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="kwh"
            stroke="#fbbf24"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#gradientRemainingDetailed)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EnergyBurnKwhChartDetailed({
  data
}: {
  data: { used: number; from: string; kwhPerHour: number }[]
}): JSX.Element {
  const maxY = Math.max(...(data?.map((d) => d.used) || [0])) * 1.2

  return (
    <div className="flex w-full h-full justify-center items-center p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="gradientBurnDetailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis
            dataKey="from"
            tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            domain={[0, maxY]}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(2)}`}
            dx={-10}
          />
          <Tooltip
            content={
              <EnergyDetailedTooltip
                unit="kWh"
                color="#ef4444"
                extraKey="kwhPerHour"
                extraUnit="/h"
              />
            }
            cursor={{ stroke: '#ef4444', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="used"
            stroke="#ef4444"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#gradientBurnDetailed)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function EnergyTimeRemainingChartDetailed({
  data
}: {
  data: { hoursLeft: number; date: string }[]
}): JSX.Element {
  const minY = Math.min(...(data?.map((d) => d.hoursLeft).filter(isFinite) || [0])) * 0.95
  const maxY = Math.max(...(data?.map((d) => d.hoursLeft).filter(isFinite) || [0])) * 1.05

  return (
    <div className="flex w-full h-full justify-center items-center p-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data ?? []} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="gradientTimeDetailed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="currentColor"
            opacity={0.1}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(value) => format(new Date(value), 'HH:mm')}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            domain={[minY, maxY]}
            fontSize={11}
            fontWeight={600}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toFixed(1)}h`}
            dx={-10}
          />
          <Tooltip
            content={<EnergyDetailedTooltip unit="hours" color="#3b82f6" />}
            cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
          />
          <Area
            type="monotone"
            dataKey="hoursLeft"
            name="Hours Remaining"
            stroke="#3b82f6"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#gradientTimeDetailed)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

const EnergyDetailedTooltip = ({
  active,
  payload,
  label,
  unit,
  color,
  extraKey,
  extraUnit
}: any): JSX.Element | null => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl ring-1 ring-black/5">
        <p className="text-sm font-medium text-muted-foreground mb-2">
          {label ? format(new Date(label as string), 'PPPP, HH:mm') : ''}
        </p>
        <div className="space-y-1.5">
          {payload.map((p, i) => (
            <div key={i} className="flex items-center justify-between gap-8">
              <div className="flex items-center gap-2">
                <div className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm capitalize text-foreground/80">{p.name}</span>
              </div>
              <span className="text-sm font-bold font-mono">
                {(p.value as number).toFixed(3)} {unit}
              </span>
            </div>
          ))}
          {extraKey && (
            <div className="flex items-center justify-between gap-8 pt-1 border-t border-border/50 mt-1">
              <span className="text-xs text-muted-foreground">Rate</span>
              <span className="text-xs font-mono font-medium">
                {(data[extraKey] as number).toFixed(3)} {unit}
                {extraUnit}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}
