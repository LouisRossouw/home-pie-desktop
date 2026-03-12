import { ChevronDown, Plus, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'
import { FinanceData, SavingGoal } from '@shared/types'

interface GoalsSectionProps {
  isGoalsOpen: boolean
  setIsGoalsOpen: (open: boolean) => void
  formData: FinanceData
  totals: {
    goalAllocations: number
  }
  addGoal: () => void
  removeGoal: (id: string) => void
  handleGoalChange: (id: string, field: keyof SavingGoal, value: string | number) => void
}

export function GoalsSection({
  isGoalsOpen,
  setIsGoalsOpen,
  formData,
  totals,
  addGoal,
  removeGoal,
  handleGoalChange
}: GoalsSectionProps) {
  return (
    <Collapsible open={isGoalsOpen} onOpenChange={setIsGoalsOpen}>
      <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
        <CollapsibleTrigger asChild>
          <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
            <div>
              <CardTitle className="flex items-center gap-2">
                Savings Goals
                <ChevronDown
                  className={`size-4 transition-transform ${isGoalsOpen ? 'rotate-180' : ''}`}
                />
              </CardTitle>
              <CardDescription>Target targets and monthly contributions</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">
                  Monthly Total
                </p>
                <p className="text-sm font-bold text-blue-400">
                  R {totals.goalAllocations.toLocaleString()}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  addGoal()
                }}
                className="h-8 gap-1 border-primary/20 hover:bg-primary/5"
              >
                <Plus className="size-3" /> Add Goal
              </Button>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-1">
              <div className="grid grid-cols-12 items-center gap-4 px-2 mb-1">
                <Label className="col-span-4 text-[10px] font-black uppercase tracking-widest opacity-50">
                  Goal
                </Label>
                <Label className="col-span-3 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Target
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">
                  Current
                </Label>
                <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-right text-blue-400">
                  Monthly
                </Label>
                <div className="col-span-1" />
              </div>

              {formData.savingGoals.map((goal) => {
                const monthsLeft =
                  goal.monthlyAllocation > 0
                    ? Math.ceil(
                        Math.max(0, goal.targetAmount - goal.currentAmount) / goal.monthlyAllocation
                      )
                    : Infinity

                return (
                  <div
                    key={goal.id}
                    className="space-y-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10"
                  >
                    <div className="grid grid-cols-12 items-center gap-2">
                      <div className="col-span-4">
                        <Input
                          value={goal.label}
                          onChange={(e) => handleGoalChange(goal.id, 'label', e.target.value)}
                          className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-semibold"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={goal.targetAmount}
                          onChange={(e) =>
                            handleGoalChange(goal.id, 'targetAmount', e.target.value)
                          }
                          className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={goal.currentAmount}
                          onChange={(e) =>
                            handleGoalChange(goal.id, 'currentAmount', e.target.value)
                          }
                          className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input
                          type="number"
                          value={goal.monthlyAllocation}
                          onChange={(e) =>
                            handleGoalChange(goal.id, 'monthlyAllocation', e.target.value)
                          }
                          className="bg-blue-500/10 border-blue-500/20 h-8 text-right font-bold text-blue-400 text-sm px-2"
                        />
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => removeGoal(goal.id)}
                          className="size-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="px-2 flex items-center justify-between text-[10px]">
                      <div className="flex-1 mr-4 bg-background/50 h-1 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%`
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {monthsLeft === Infinity
                          ? 'No allocation'
                          : monthsLeft === 0
                            ? 'Goal Reached!'
                            : `Reached in ${monthsLeft} months`}
                      </span>
                    </div>
                  </div>
                )
              })}

              {formData.savingGoals.length === 0 && (
                <div className="text-center py-6 text-muted-foreground italic text-sm border-2 border-dashed border-border/20 rounded-xl">
                  No goals added yet.
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
