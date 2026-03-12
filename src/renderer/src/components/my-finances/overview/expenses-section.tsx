import { ChevronDown, Plus, ReceiptText, Trash2 } from 'lucide-react'
import { FinanceData } from '@shared/types'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'

interface ExpensesSectionProps {
  isExpensesOpen: boolean
  setIsExpensesOpen: (open: boolean) => void
  formData: FinanceData
  totals: {
    totalExpenses: number
  }
  addExpense: () => void
  removeExpense: (id: string) => void
  handleExpenseChange: (id: string, label: string, amount: string) => void
}

export function ExpensesSection({
  isExpensesOpen,
  setIsExpensesOpen,
  formData,
  totals,
  addExpense,
  removeExpense,
  handleExpenseChange
}: ExpensesSectionProps) {
  return (
    <Collapsible open={isExpensesOpen} onOpenChange={setIsExpensesOpen}>
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <CardTitle className="flex items-center gap-2">
                Monthly Expenses
                <ChevronDown
                  className={`size-4 transition-transform ${isExpensesOpen ? 'rotate-180' : ''}`}
                />
              </CardTitle>
              <CardDescription>Fixed and variable costs</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Total
                </p>
                <p className="text-sm font-bold text-red-500">
                  R {totals.totalExpenses.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  addExpense()
                }}
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="size-3" /> Add Item
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {formData.expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center gap-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
              >
                <ReceiptText className="size-4 text-muted-foreground shrink-0" />
                <Input
                  placeholder="Category"
                  value={expense.label}
                  onChange={(e) =>
                    handleExpenseChange(expense.id, e.target.value, expense.amount.toString())
                  }
                  className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2"
                />
                <Input
                  type="number"
                  placeholder="Amount"
                  value={expense.amount}
                  onChange={(e) => handleExpenseChange(expense.id, expense.label, e.target.value)}
                  className="w-28 border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm text-right px-2 font-mono"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeExpense(expense.id)}
                  className="size-8 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            {formData.expenses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground italic text-sm border-2 border-dashed border-border/20 rounded-xl">
                No expenses added yet.
              </div>
            )}
            <div className="flex justify-between items-center border-t border-border/50 pt-3 px-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Expenses
              </span>
              <span className="text-lg font-mono font-bold text-red-400">
                R {totals.totalExpenses.toLocaleString()}
              </span>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
