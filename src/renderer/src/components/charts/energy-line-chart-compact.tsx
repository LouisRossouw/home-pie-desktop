import { format } from 'date-fns'
import {
    Area,
    ComposedChart,
    YAxis,
    ResponsiveContainer,
    XAxis,
    TooltipProps,
    Tooltip,
} from 'recharts'
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent'

export function EnerygyRemainingKwhChart({ data }: { data: { kwh: number; date: string }[] }): JSX.Element {
    const minY = Math.min(...(data?.map((d) => d.kwh) || [0])) * 0.99
    const maxY = Math.max(...(data?.map((d) => d.kwh) || [0])) * 1.01

    return (
        <div className="flex w-full h-24 justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data ?? []} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                        <linearGradient id="gradientRemaining" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#fbbf24" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={[minY, maxY]} hide />
                    <XAxis dataKey="date" hide />
                    {data && (
                        <Tooltip
                            content={<EnergyRemaininigTooltip />}
                            cursor={{ stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="kwh"
                        stroke="#fbbf24"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#gradientRemaining)"
                        activeDot={{ r: 4, fill: '#fbbf24', strokeWidth: 2, stroke: '#fff' }}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

export function EnergyBurnKwhChart({ data }: { data: { used: number; from: string; kwhPerHour: number }[] }): JSX.Element {
    const minY = 0
    const maxY = Math.max(...(data?.map((d) => d.used) || [0])) * 1.2

    return (
        <div className="flex w-full h-24 justify-center items-center">
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data ?? []} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <defs>
                        <linearGradient id="gradientBurn" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <YAxis domain={[minY, maxY]} hide />
                    <XAxis dataKey="from" hide />
                    {data && (
                        <Tooltip
                            content={<BurnRateTooltip />}
                            cursor={{ stroke: '#ef4444', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="used"
                        stroke="#ef4444"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#gradientBurn)"
                        activeDot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }}
                        dot={false}
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    )
}

const EnergyRemaininigTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2 text-xs shadow-lg">
                <p className="text-muted-foreground mb-1">
                    {label ? format(new Date(label as string), 'MMM d, HH:mm') : ''}
                </p>
                <p className="font-bold flex items-center gap-1">
                    <span className="size-2 rounded-full bg-yellow-400" />
                    {(payload.find((p) => p.dataKey === 'kwh')?.value as number)?.toFixed(2)} kWh
                </p>
            </div>
        )
    }

    return null
}

const BurnRateTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element | null => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background/90 backdrop-blur-sm border rounded-lg p-2 text-xs shadow-lg">
                <p className="text-muted-foreground mb-1">
                    {label ? format(new Date(label as string), 'MMM d, HH:mm') : ''}
                </p>
                <div className="space-y-1">
                    <p className="font-bold flex items-center gap-1 text-red-500">
                        <span className="size-2 rounded-full bg-red-500" />
                        Used: {(payload.find((p) => p.dataKey === 'used')?.value as number)?.toFixed(3)} kWh
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                        Rate: {(payload.find((p) => p.dataKey === 'kwhPerHour')?.value as number)?.toFixed(3)} kWh/h
                    </p>
                </div>
            </div>
        )
    }

    return null
}


