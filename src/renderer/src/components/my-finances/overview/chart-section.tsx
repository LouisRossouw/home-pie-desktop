import { TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'

interface ChartSectionProps {
  showProjections: boolean
  setShowProjections: (show: boolean) => void
  chartData: any[]
  projectionTarget: number
  currentNetWorth: number
}

export function ChartSection({
  showProjections,
  setShowProjections,
  chartData,
  projectionTarget,
  currentNetWorth
}: ChartSectionProps) {
  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Net Worth Trajectory</CardTitle>
          <CardDescription>
            {showProjections ? 'History + 10-year projection' : 'Historical records only'}
          </CardDescription>
        </div>
        <button
          onClick={() => setShowProjections(!showProjections)}
          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
            showProjections
              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25'
              : 'bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted/70'
          }`}
        >
          <TrendingUp className="size-3" />
          {showProjections ? 'Projections On' : 'History Only'}
        </button>
      </CardHeader>
      <CardContent className="flex-1 w-full h-full min-h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={showProjections ? chartData : chartData.filter((d) => d.isHistory)}
            margin={{ top: 10, right: 30, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorGoals" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
            <XAxis
              dataKey="label"
              stroke="#888"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              interval={'preserveStartEnd'}
            />
            <YAxis
              stroke="#888"
              fontSize={11}
              axisLine={false}
              tickLine={false}
              domain={['auto', 'auto']}
              tickFormatter={(val) =>
                `R ${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'}`
              }
              width={50}
            />
            <Tooltip
              cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload
                  const isHistory = data.isHistory
                  return (
                    <div className="bg-black/80 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-2xl min-w-[200px]">
                      <div className="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">
                          {isHistory ? 'History' : 'Projection'}
                        </span>
                        <span className="text-xs font-bold text-white">{label}</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs items-center">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-blue-500" />
                            <span className="text-muted-foreground">Investments</span>
                          </div>
                          <span className="font-mono font-bold">
                            R {(data.investments || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs items-center">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-purple-500" />
                            <span className="text-muted-foreground">Goals</span>
                          </div>
                          <span className="font-mono font-bold">
                            R {(data.goals || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs items-center">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-green-500" />
                            <span className="text-muted-foreground">Savings</span>
                          </div>
                          <span className="font-mono font-bold">
                            R {(data.cash || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs items-center opacity-50">
                          <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-red-500" />
                            <span className="text-muted-foreground">Debt</span>
                          </div>
                          <span className="font-mono font-bold">
                            - R {(data.debt || 0).toLocaleString()}
                          </span>
                        </div>
                        <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                          <span className="text-xs font-black text-primary uppercase">
                            Net Worth
                          </span>
                          <span className="text-sm font-black text-primary">
                            R {data.netWorth.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              stackId="wealth"
              type="monotone"
              dataKey="investments"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorInvestments)"
              animationDuration={1000}
            />
            <Area
              stackId="wealth"
              type="monotone"
              dataKey="goals"
              stroke="#a855f7"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGoals)"
              animationDuration={1200}
            />
            <Area
              stackId="wealth"
              type="monotone"
              dataKey="cash"
              stroke="#22c55e"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCash)"
              animationDuration={1400}
            />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="#fff"
              strokeWidth={4}
              fill="none"
              strokeDasharray="5 5"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 p-4 border-t border-border/50 bg-primary/5 rounded-b-xl">
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Projected Gain
            </span>
            <span className="text-xl font-bold text-green-500">
              + R {(projectionTarget - currentNetWorth).toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
