import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { FinanceData, DebtItem } from '@shared/types'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'

interface DebtSectionProps {
  isDebtsOpen: boolean
  setIsDebtsOpen: (open: boolean) => void
  formData: FinanceData
  selectedMonth: number
  selectedYear: number
  totals: {
    totalDebt: number
    debtAllocations: number
  }
  addDebt: () => void
  removeDebt: (id: string) => void
  handleDebtChange: (id: string, field: keyof DebtItem, value: string | number) => void
  calculateDebtProgress: (
    debt: DebtItem,
    currentMonth: number,
    currentYear: number
  ) => {
    remainingAmount: number
    totalPaid: number
    monthsElapsed: number
  }
}

export function DebtSection({
  isDebtsOpen,
  setIsDebtsOpen,
  formData,
  selectedMonth,
  selectedYear,
  totals,
  addDebt,
  removeDebt,
  handleDebtChange,
  calculateDebtProgress
}: DebtSectionProps) {
  return (
    <Collapsible open={isDebtsOpen} onOpenChange={setIsDebtsOpen}>
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <CardTitle className="flex items-center gap-2">
                Debts & Liabilities
                <ChevronDown
                  className={`size-4 transition-transform ${isDebtsOpen ? 'rotate-180' : ''}`}
                />
              </CardTitle>
              <CardDescription>Track debt payoff with interest calculations</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Total Debt
                </p>
                <p className="text-sm font-bold text-red-500">
                  R {totals.totalDebt.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  addDebt()
                }}
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="size-3" /> Add Debt
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-12 items-center gap-2 px-2 mb-1">
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50">
                  Label
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Total
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Remaining
                </Label>
                <Label className="col-span-1 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Rate%
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center text-blue-400">
                  Monthly
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-right text-green-400">
                  Paid
                </Label>
                <div className="col-span-1" />
              </div>

              {(formData.debts || []).map((debt) => {
                const { remainingAmount, totalPaid } = calculateDebtProgress(
                  debt,
                  selectedMonth,
                  selectedYear
                )
                const monthsLeft =
                  debt.monthlyAllocation > 0 && remainingAmount > 0
                    ? Math.ceil(remainingAmount / debt.monthlyAllocation)
                    : Infinity
                const percentPaid = debt.totalAmount > 0 ? (totalPaid / debt.totalAmount) * 100 : 0

                return (
                  <div
                    key={debt.id}
                    className="space-y-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                  >
                    <div className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-2">
                        <Input
                          value={debt.label}
                          onChange={(e) => handleDebtChange(debt.id, 'label', e.target.value)}
                          className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-semibold"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={debt.totalAmount}
                          onChange={(e) => handleDebtChange(debt.id, 'totalAmount', e.target.value)}
                          className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="h-8 flex items-center justify-center text-sm font-mono text-red-400 bg-red-500/10 rounded px-2">
                          {remainingAmount.toLocaleString()}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          value={debt.interestRate}
                          onChange={(e) =>
                            handleDebtChange(debt.id, 'interestRate', e.target.value)
                          }
                          className="border-none bg-yellow-500/10 hover:bg-yellow-500/20 focus:bg-yellow-500/30 h-8 text-sm px-2 font-mono text-center text-yellow-400"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={debt.monthlyAllocation}
                          onChange={(e) =>
                            handleDebtChange(debt.id, 'monthlyAllocation', e.target.value)
                          }
                          className="bg-blue-500/10 border-blue-500/20 h-8 text-center font-bold text-blue-400 text-sm px-2"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="h-8 flex items-center justify-end text-sm font-mono text-green-400 bg-green-500/10 rounded px-2">
                          {totalPaid.toLocaleString()}
                        </div>
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeDebt(debt.id)}
                          className="size-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="px-2 flex items-center justify-between text-[10px]">
                      <div className="flex-1 mr-4 bg-background/50 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-green-500 h-full transition-all duration-500"
                          style={{ width: `${Math.min(100, percentPaid)}%` }}
                        />
                      </div>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {remainingAmount <= 0
                          ? 'Paid Off!'
                          : monthsLeft === Infinity
                            ? 'No allocation'
                            : `${monthsLeft} months left`}
                      </span>
                    </div>
                  </div>
                )
              })}

              {(formData.debts || []).length === 0 && (
                <div className="text-center py-6 text-muted-foreground italic text-sm border-2 border-dashed border-border/20 rounded-xl">
                  No debts added yet.
                </div>
              )}
            </div>

            <div className="mt-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-[11px] space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Debt Remaining:</span>
                <span className="font-bold text-red-400">
                  R {totals.totalDebt.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monthly Debt Payments:</span>
                <span className="font-bold text-blue-400">
                  R {totals.debtAllocations.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
