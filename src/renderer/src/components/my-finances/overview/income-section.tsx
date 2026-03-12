import { ChevronDown, Plus, ArrowUpCircle, Trash2, Percent } from 'lucide-react'
import { FinanceData, IncomeItem } from '@shared/types'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'

interface IncomeSectionProps {
  isIncomeOpen: boolean
  setIsIncomeOpen: (open: boolean) => void
  formData: FinanceData
  totals: {
    netIncome: number
    tax: number
    grossIncome: number
  }
  hideValues: boolean
  addIncomeSource: () => void
  removeIncomeSource: (id: string) => void
  handleIncomeSourceChange: (id: string, field: keyof IncomeItem, value: string) => void
  handleInputChange: (key: keyof FinanceData, value: string | number) => void
}

export function IncomeSection({
  isIncomeOpen,
  setIsIncomeOpen,
  formData,
  totals,
  hideValues,
  addIncomeSource,
  removeIncomeSource,
  handleIncomeSourceChange,
  handleInputChange
}: IncomeSectionProps) {
  return (
    <Collapsible open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <CardTitle className="flex items-center gap-2">
                Income &amp; Tax
                <ChevronDown
                  className={`size-4 transition-transform ${isIncomeOpen ? 'rotate-180' : ''}`}
                />
              </CardTitle>
              <CardDescription>Monthly earnings and tax rate</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Net Monthly</p>
                <p
                  className={`text-lg font-bold text-green-500 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}
                >
                  R {totals.netIncome.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  addIncomeSource()
                }}
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="size-3" /> Add Source
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3">
            {formData.incomeSources.map((src) => (
              <div
                key={src.id}
                className="flex items-center gap-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
              >
                <ArrowUpCircle className="size-4 text-green-500 shrink-0" />
                <Input
                  placeholder="Source label"
                  value={src.label}
                  onChange={(e) => handleIncomeSourceChange(src.id, 'label', e.target.value)}
                  className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={src.amount}
                  onChange={(e) => handleIncomeSourceChange(src.id, 'amount', e.target.value)}
                  className="w-28 border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm text-right px-2 font-mono"
                />
                <div className="flex items-center gap-0.5 shrink-0">
                  <Input
                    type="number"
                    placeholder={String(formData.taxRate)}
                    value={src.taxRate !== undefined ? src.taxRate : ''}
                    onChange={(e) => handleIncomeSourceChange(src.id, 'taxRate', e.target.value)}
                    title="Tax rate for this source (leave blank to use global rate)"
                    className="w-14 border-none bg-yellow-500/10 hover:bg-yellow-500/20 h-8 text-sm text-right px-2 font-mono text-yellow-400 border-yellow-500/20"
                  />
                  <Percent className="size-3 text-yellow-500/60 shrink-0" />
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeIncomeSource(src.id)}
                  disabled={formData.incomeSources.length <= 1}
                  className="size-8 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0 disabled:pointer-events-none"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-3">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 font-semibold text-xs">
                  <Percent className="size-3 text-yellow-500" /> Tax Rate (%)
                </Label>
                <Input
                  type="number"
                  value={formData.taxRate}
                  onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  className="bg-background/30 border-primary/10 h-9"
                />
              </div>
              <div className="space-y-2 text-right">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Tax Deduction
                </p>
                <p className="text-lg font-bold text-yellow-500 mt-1">
                  - R {totals.tax.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center border-t border-border/50 pt-3 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Gross Income
              </span>
              <span className="text-lg font-mono font-bold text-green-400">
                R {totals.grossIncome.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
