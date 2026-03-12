import { Wallet, TrendingUp, TrendingDown, Landmark } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface SummaryCardsProps {
  currentNetWorth: number
  monthlySavings: number
  prevMonthSavings: number | null
  totalExpenses: number
  fiveYearProjection: number
  tenYearProjection: number
  hideValues: boolean
  monthNames: string[]
  selectedMonth: number
}

export function SummaryCards({
  currentNetWorth,
  monthlySavings,
  prevMonthSavings,
  totalExpenses,
  fiveYearProjection,
  tenYearProjection,
  hideValues,
  monthNames,
  selectedMonth
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-card/50 backdrop-blur-md border-primary/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
          <Wallet className="size-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}
          >
            R {currentNetWorth.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
            Current Balance
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-green-500/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
          <TrendingUp className="size-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div
              className={`text-2xl font-bold transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''} ${monthlySavings < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              R {monthlySavings.toLocaleString()}
            </div>
            {prevMonthSavings !== null &&
              (() => {
                const diff = monthlySavings - prevMonthSavings
                const better = diff >= 0
                return (
                  <span
                    className={`flex items-center gap-0.5 text-xs font-bold pb-0.5 ${
                      better ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {better ? (
                      <TrendingUp className="size-3" />
                    ) : (
                      <TrendingDown className="size-3" />
                    )}
                    {better ? '+' : ''}R {diff.toLocaleString()}
                  </span>
                )
              })()}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">
              - R {totalExpenses.toLocaleString()}
            </span>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">
              After Tax & Expenses
            </p>
          </div>
          {prevMonthSavings !== null && (
            <p className="text-[9px] text-muted-foreground/60 mt-1">
              vs. {monthNames[selectedMonth === 0 ? 11 : selectedMonth - 1]}
            </p>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-blue-500/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">5-Year Projection</CardTitle>
          <Landmark className="size-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold text-blue-400 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}
          >
            R {fiveYearProjection.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
            Estimated Growth
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-md border-purple-500/20 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">10-Year Projection</CardTitle>
          <TrendingUp className="size-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold text-purple-400 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}
          >
            R {tenYearProjection.toLocaleString()}
          </div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">
            Wealth Trajectory
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
