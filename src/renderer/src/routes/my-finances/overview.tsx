import { useState, useMemo, useEffect } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import { Landmark, TrendingUp, TrendingDown, Wallet, ArrowUpCircle, Percent, Plus, Trash2, Calendar, ReceiptText, ChevronDown, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { useFinances } from '~/libs/hooks/use-finances'
import { FinanceData, IncomeItem, AssetItem, SavingGoal } from '@shared/types'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible'


export default function MyFinancesOverviewRoute() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [isIncomeOpen, setIsIncomeOpen] = useState(false)
  const [isExpensesOpen, setIsExpensesOpen] = useState(false)
  const [isGoalsOpen, setIsGoalsOpen] = useState(false)
  const [isAssetsOpen, setIsAssetsOpen] = useState(false)
  const [showProjections, setShowProjections] = useState(true)
  const [hideValues, setHideValues] = useState(false)

  const { finances, records, saveFinances, isSaving } = useFinances(selectedMonth, selectedYear)
  const [formData, setFormData] = useState<FinanceData | null>(null)

  useEffect(() => {
    if (finances) {
      setFormData(finances)
    }
  }, [finances])

  const handleInputChange = (key: keyof FinanceData, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
    setFormData((prev) => (prev ? { ...prev, [key]: numValue } : null))
  }

  const handleExpenseChange = (id: string, label: string, amount: string) => {
    const numAmount = parseFloat(amount) || 0
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        expenses: prev.expenses.map(e => e.id === id ? { ...e, label, amount: numAmount } : e)
      }
    })
  }

  const handleIncomeSourceChange = (id: string, field: keyof IncomeItem, value: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        incomeSources: prev.incomeSources.map(s => {
          if (s.id !== id) return s
          if (field === 'taxRate') {
            // Allow clearing the field to revert to global rate
            const parsed = value === '' ? undefined : (parseFloat(value) ?? undefined)
            return { ...s, taxRate: parsed }
          }
          return { ...s, [field]: field === 'amount' ? (parseFloat(value) || 0) : value }
        })
      }
    })
  }

  const addIncomeSource = () => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        incomeSources: [...prev.incomeSources, { id: crypto.randomUUID(), label: 'New Source', amount: 0 }]
      }
    })
  }

  const removeIncomeSource = (id: string) => {
    setFormData(prev => {
      if (!prev) return null
      if (prev.incomeSources.length <= 1) return prev // keep at least one
      return {
        ...prev,
        incomeSources: prev.incomeSources.filter(s => s.id !== id)
      }
    })
  }

  const addExpense = () => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        expenses: [...prev.expenses, { id: crypto.randomUUID(), label: 'New Expense', amount: 0 }]
      }
    })
  }

  const removeExpense = (id: string) => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        expenses: prev.expenses.filter(e => e.id !== id)
      }
    })
  }

  const handleAssetChange = (id: string, field: keyof AssetItem, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assets: prev.assets.map(a => a.id === id ? { ...a, [field]: numValue } : a)
      }
    })
  }

  const addAsset = () => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        assets: [...prev.assets, { id: crypto.randomUUID(), label: 'New Asset', value: 0, growth: 5, allocation: 0 }]
      }
    })
  }

  const removeAsset = (id: string) => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        assets: prev.assets.filter(a => a.id !== id)
      }
    })
  }

  const handleGoalChange = (id: string, field: keyof SavingGoal, value: string | number) => {
    const val = field === 'label' ? value : (parseFloat(value.toString()) || 0)
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: prev.savingGoals.map(g => g.id === id ? { ...g, [field]: val } : g)
      }
    })
  }

  const addGoal = () => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 11)
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: [...prev.savingGoals, { id, label: 'New Goal', targetAmount: 5000, currentAmount: 0, monthlyAllocation: 500 }]
      }
    })
  }

  const removeGoal = (id: string) => {
    setFormData(prev => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: prev.savingGoals.filter(g => g.id !== id)
      }
    })
  }

  const handleSave = () => {
    if (formData) {
      saveFinances(formData)
    }
  }

  const totals = useMemo(() => {
    if (!formData) return { tax: 0, netIncome: 0, totalExpenses: 0, monthlySavings: 0, totalAllocations: 0, assetAllocations: 0, goalAllocations: 0, grossIncome: 0 }

    const grossIncome = (formData.incomeSources || []).reduce((sum, s) => sum + s.amount, 0)
    // Tax: each source uses its own rate if set, otherwise global taxRate
    const tax = (formData.incomeSources || []).reduce((sum, s) => {
      const rate = s.taxRate !== undefined ? s.taxRate : formData.taxRate
      return sum + s.amount * (rate / 100)
    }, 0)
    const netIncome = grossIncome - tax
    const expenseArray = Array.isArray(formData.expenses) ? formData.expenses : []
    const totalExpenses = expenseArray.reduce((sum, e) => sum + e.amount, 0)
    const monthlySavings = netIncome - totalExpenses
    const assetAllocations = (formData.assets || []).reduce((sum, a) => sum + a.allocation, 0)
    const goalAllocations = (formData.savingGoals || []).reduce((sum, g) => sum + g.monthlyAllocation, 0)
    const totalAllocations = assetAllocations + goalAllocations

    return { tax, netIncome, totalExpenses, monthlySavings, totalAllocations, assetAllocations, goalAllocations, grossIncome }
  }, [formData])

  // Previous month's saved record for MoM comparison
  const prevMonthSavings = useMemo(() => {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear
    const rec = records.find(r => r.month === prevMonth && r.year === prevYear)
    if (!rec) return null
    const d = rec.data
    const grossIncome = (d.incomeSources || []).reduce((s, src) => s + src.amount, d.income ?? 0)
    const tax = (d.incomeSources || [{ id: '', label: '', amount: d.income ?? 0 }]).reduce((sum, s) => {
      const rate = s.taxRate !== undefined ? s.taxRate : d.taxRate
      return sum + s.amount * (rate / 100)
    }, 0)
    const netIncome = grossIncome - tax
    const totalExpenses = (Array.isArray(d.expenses) ? d.expenses : []).reduce((s, e) => s + e.amount, 0)
    return netIncome - totalExpenses
  }, [records, selectedMonth, selectedYear])

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

  const chartData = useMemo(() => {
    if (!formData) return []

    const data: any[] = []

    // 1. Process Historical Records
    const sortedRecords = [...records].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    sortedRecords.forEach(r => {
      const assetNW = r.data.assets.reduce((sum, a) => sum + a.value, 0)
      const currentNW = assetNW - r.data.debt
      data.push({
        label: `${monthNames[r.month]} ${r.year}`,
        netWorth: currentNW,
        investments: currentNW,
        goals: 0,
        cash: 0,
        debt: 0,
        isHistory: true
      })
    })

    // 2. Generate Projections (10 Years from now)
    const years = 10
    const months = years * 12

    const gSavings = 1 + formData.growthRate / 100 / 12

    // Initialize asset tracking
    let currentAssets = formData.assets.map(a => ({ ...a, currentValue: a.value }))
    let currentGoals = (formData.savingGoals || []).map(g => ({ ...g, currentSimulatedAmount: g.currentAmount }))
    let currentDebt = formData.debt

    const assetAllocations = formData.assets.reduce((sum, a) => sum + a.allocation, 0)
    let currentSavingsPool = 0

    for (let i = 1; i <= months; i++) {
      // Calculate goal allocations for this month
      let activeGoalAllocations = 0
      currentGoals = currentGoals.map(g => {
        if (g.currentSimulatedAmount < g.targetAmount) {
          const allocation = Math.min(g.monthlyAllocation, g.targetAmount - g.currentSimulatedAmount)
          activeGoalAllocations += allocation
          return { ...g, currentSimulatedAmount: g.currentSimulatedAmount + allocation }
        }
        return g
      })

      const totalAllocations = assetAllocations + activeGoalAllocations
      const leftoverMonthlySavings = Math.max(0, totals.monthlySavings - totalAllocations)

      // Grow and contribute to each asset
      currentAssets = currentAssets.map(a => {
        const monthlyGrowth = 1 + a.growth / 100 / 12
        return {
          ...a,
          currentValue: (a.currentValue + a.allocation) * monthlyGrowth
        }
      })

      currentSavingsPool = (currentSavingsPool + leftoverMonthlySavings) * gSavings

      const totalAssetValue = currentAssets.reduce((sum, a) => sum + a.currentValue, 0)
      const totalGoalValue = currentGoals.reduce((sum, g) => sum + g.currentSimulatedAmount, 0)
      const totalNetWorth = totalAssetValue + totalGoalValue + currentSavingsPool - currentDebt

      // Push data every 6 months for a smoother but clean graph
      if (i % 6 === 0) {
        data.push({
          label: `+${i / 12}y`,
          netWorth: Math.round(totalNetWorth),
          investments: Math.round(totalAssetValue),
          goals: Math.round(totalGoalValue),
          cash: Math.round(currentSavingsPool),
          debt: Math.round(currentDebt),
          isHistory: false
        })
      }
    }
    return data
  }, [formData, records, totals])

  if (!formData) return <div className="p-8">Loading...</div>

  const currentNetWorth = formData.assets.reduce((sum, a) => sum + a.value, 0) - formData.debt

  const projectionTarget = chartData[chartData.length - 1]?.netWorth || 0

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto p-6 space-y-6 bg-background/50 text-foreground">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Financial Portfolio</h1>
            <p className="text-muted-foreground text-sm">Track history and project future growth.</p>
          </div>
          <div className="flex items-center gap-2 bg-card/40 p-1.5 rounded-xl border border-primary/10">
            <Calendar className="size-4 text-primary ml-2" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
            >
              {monthNames.map((m, i) => <option key={m} value={i} className="bg-background">{m}</option>)}
            </select>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
            >
              {years.map(y => <option key={y} value={y} className="bg-background">{y}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideValues(v => !v)}
            title={hideValues ? 'Show values' : 'Hide values'}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border transition-all bg-card/40 border-border/50 text-muted-foreground hover:text-foreground hover:bg-card/80"
          >
            {hideValues ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
          </button>
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving Record...' : 'Save Record'}
          </Button>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur-md border-primary/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Worth</CardTitle>
            <Wallet className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}>R {currentNetWorth.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Current Balance</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-md border-green-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Net Savings</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-3">
              <div className={`text-2xl font-bold transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''} ${totals.monthlySavings < 0 ? 'text-red-500' : 'text-green-500'}`}>
                R {totals.monthlySavings.toLocaleString()}
              </div>
              {prevMonthSavings !== null && (() => {
                const diff = totals.monthlySavings - prevMonthSavings
                const better = diff >= 0
                return (
                  <span className={`flex items-center gap-0.5 text-xs font-bold pb-0.5 ${better ? 'text-green-400' : 'text-red-400'
                    }`}>
                    {better
                      ? <TrendingUp className="size-3" />
                      : <TrendingDown className="size-3" />}
                    {better ? '+' : ''}R {diff.toLocaleString()}
                  </span>
                )
              })()}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-red-400 font-bold bg-red-400/10 px-1.5 py-0.5 rounded border border-red-400/20">- R {totals.totalExpenses.toLocaleString()}</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">After Tax & Expenses</p>
            </div>
            {prevMonthSavings !== null && (
              <p className="text-[9px] text-muted-foreground/60 mt-1">vs. {monthNames[selectedMonth === 0 ? 11 : selectedMonth - 1]}</p>
            )}
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-md border-blue-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">5-Year Projection</CardTitle>
            <Landmark className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-blue-400 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}>R {(chartData.find(d => d.label === '+5y')?.netWorth || 0).toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Estimated Growth</p>
          </CardContent>
        </Card>
        <Card className="bg-card/50 backdrop-blur-md border-purple-500/20 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">10-Year Projection</CardTitle>
            <TrendingUp className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold text-purple-400 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}>R {projectionTarget.toLocaleString()}</div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-1">Wealth Trajectory</p>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Collapsible open={isIncomeOpen} onOpenChange={setIsIncomeOpen}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Income &amp; Tax
                      <ChevronDown className={`size-4 transition-transform ${isIncomeOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <CardDescription>Monthly earnings and tax rate</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Net Monthly</p>
                      <p className={`text-lg font-bold text-green-500 transition-all duration-300 select-none ${hideValues ? 'blur-md' : ''}`}>R {totals.netIncome.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addIncomeSource(); }} className="h-8 gap-1 border-primary/20 hover:bg-primary/5">
                      <Plus className="size-3" /> Add Source
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3">
                  {formData.incomeSources.map((src) => (
                    <div key={src.id} className="flex items-center gap-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
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
                      <Label className="flex items-center gap-2 font-semibold text-xs"><Percent className="size-3 text-yellow-500" /> Tax Rate (%)</Label>
                      <Input
                        type="number"
                        value={formData.taxRate}
                        onChange={(e) => handleInputChange('taxRate', e.target.value)}
                        className="bg-background/30 border-primary/10 h-9"
                      />
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Tax Deduction</p>
                      <p className="text-lg font-bold text-yellow-500 mt-1">- R {totals.tax.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center border-t border-border/50 pt-3 px-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Gross Income</span>
                    <span className="text-lg font-mono font-bold text-green-400">R {totals.grossIncome.toLocaleString()}</span>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={isExpensesOpen} onOpenChange={setIsExpensesOpen}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Monthly Expenses
                      <ChevronDown className={`size-4 transition-transform ${isExpensesOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <CardDescription>Fixed and variable costs</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total</p>
                      <p className="text-sm font-bold text-red-500">R {totals.totalExpenses.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addExpense(); }} className="h-8 gap-1 border-primary/20 hover:bg-primary/5">
                      <Plus className="size-3" /> Add Item
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {formData.expenses.map((expense) => (
                    <div key={expense.id} className="flex items-center gap-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                      <ReceiptText className="size-4 text-muted-foreground shrink-0" />
                      <Input
                        placeholder="Category"
                        value={expense.label}
                        onChange={(e) => handleExpenseChange(expense.id, e.target.value, expense.amount.toString())}
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
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Expenses</span>
                    <span className="text-lg font-mono font-bold text-red-400">R {totals.totalExpenses.toLocaleString()}</span>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

          <Collapsible open={isGoalsOpen} onOpenChange={setIsGoalsOpen}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Savings Goals
                      <ChevronDown className={`size-4 transition-transform ${isGoalsOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <CardDescription>Target targets and monthly contributions</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Monthly Total</p>
                      <p className="text-sm font-bold text-blue-400">R {totals.goalAllocations.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addGoal(); }} className="h-8 gap-1 border-primary/20 hover:bg-primary/5">
                      <Plus className="size-3" /> Add Goal
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-1">
                    <div className="grid grid-cols-12 items-center gap-4 px-2 mb-1">
                      <Label className="col-span-4 text-[10px] font-black uppercase tracking-widest opacity-50">Goal</Label>
                      <Label className="col-span-3 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Target</Label>
                      <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Current</Label>
                      <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-right text-blue-400">Monthly</Label>
                      <div className="col-span-1" />
                    </div>

                    {formData.savingGoals.map((goal) => {
                      const monthsLeft = goal.monthlyAllocation > 0
                        ? Math.ceil(Math.max(0, goal.targetAmount - goal.currentAmount) / goal.monthlyAllocation)
                        : Infinity

                      return (
                        <div key={goal.id} className="space-y-2 group p-2 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
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
                                onChange={(e) => handleGoalChange(goal.id, 'targetAmount', e.target.value)}
                                className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={goal.currentAmount}
                                onChange={(e) => handleGoalChange(goal.id, 'currentAmount', e.target.value)}
                                className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                              />
                            </div>
                            <div className="col-span-2">
                              <Input
                                type="number"
                                value={goal.monthlyAllocation}
                                onChange={(e) => handleGoalChange(goal.id, 'monthlyAllocation', e.target.value)}
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
                                style={{ width: `${Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)}%` }}
                              />
                            </div>
                            <span className="text-muted-foreground whitespace-nowrap">
                              {monthsLeft === Infinity ? 'No allocation' : monthsLeft === 0 ? 'Goal Reached!' : `Reached in ${monthsLeft} months`}
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

          <Collapsible open={isAssetsOpen} onOpenChange={setIsAssetsOpen}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CollapsibleTrigger asChild>
                <CardHeader className="flex flex-row items-center justify-between cursor-pointer hover:bg-primary/5 transition-colors">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Portfolio Assets
                      <ChevronDown className={`size-4 transition-transform ${isAssetsOpen ? 'rotate-180' : ''}`} />
                    </CardTitle>
                    <CardDescription>Values, yearly returns, and contributions</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Monthly Total</p>
                      <p className="text-sm font-bold text-blue-400">R {totals.assetAllocations.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={(e) => { e.stopPropagation(); addAsset(); }} className="h-8 gap-1 border-primary/20 hover:bg-primary/5">
                      <Plus className="size-3" /> Add Asset
                    </Button>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-1">
                    <div className="grid grid-cols-12 items-center gap-4 px-2 mb-1">
                      <Label className="col-span-4 text-[10px] font-black uppercase tracking-widest opacity-50">Asset Label</Label>
                      <Label className="col-span-3 text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Value</Label>
                      <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-center text-primary/80">Yield%</Label>
                      <Label className="col-span-2 text-[10px] font-black uppercase tracking-widest opacity-50 text-right text-blue-400">Mo. Alloc</Label>
                      <div className="col-span-1" />
                    </div>

                    {formData.assets.map((asset) => (
                      <div key={asset.id} className="grid grid-cols-12 items-center gap-2 group p-1.5 rounded-lg hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/10">
                        <div className="col-span-4">
                          <Input
                            value={asset.label}
                            onChange={(e) => handleAssetChange(asset.id, 'label', e.target.value)}
                            className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-semibold"
                          />
                        </div>
                        <div className="col-span-3">
                          <Input
                            type="number"
                            value={asset.value}
                            onChange={(e) => handleAssetChange(asset.id, 'value', e.target.value)}
                            className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={asset.growth}
                            onChange={(e) => handleAssetChange(asset.id, 'growth', e.target.value)}
                            className="border-none bg-transparent hover:bg-background/30 focus:bg-background/50 h-8 text-sm px-2 font-mono text-center text-green-400"
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={asset.allocation}
                            onChange={(e) => handleAssetChange(asset.id, 'allocation', e.target.value)}
                            className="bg-blue-500/10 border-blue-500/20 h-8 text-right font-bold text-blue-400 text-sm px-2"
                          />
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => removeAsset(asset.id)}
                            className="size-7 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    {formData.assets.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground italic text-sm border-2 border-dashed border-border/20 rounded-xl">
                        No assets added yet.
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-border/50 pt-4">
                    <div className="space-y-1.5 text-red-400">
                      <Label className="text-[10px] uppercase font-black tracking-tighter opacity-70">Total Debt</Label>
                      <Input type="number" value={formData.debt} onChange={(e) => handleInputChange('debt', e.target.value)} className="bg-red-500/5 h-8 border-red-500/20 text-red-400" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-black tracking-tighter opacity-70 text-blue-400">Leftover Savings ROI %</Label>
                      <Input type="number" value={formData.growthRate} onChange={(e) => handleInputChange('growthRate', e.target.value)} className="bg-blue-500/5 h-8 font-bold border-blue-500/20 text-blue-300" />
                    </div>
                  </div>

                  <div className="mt-2 p-2.5 rounded-lg bg-blue-500/5 border border-blue-500/10 text-[11px] space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Monthly Allocations:</span>
                      <span className="font-bold text-blue-400">R {totals.totalAllocations.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Monthly Savings:</span>
                      <span className={`font-bold ${totals.monthlySavings < totals.totalAllocations ? 'text-orange-400' : 'text-green-500'}`}>
                        R {totals.monthlySavings.toLocaleString()}
                      </span>
                    </div>
                    {totals.monthlySavings < totals.totalAllocations && (
                      <p className="text-[9px] text-orange-400 font-medium brightness-125 pt-1">
                        ⚠️ Total allocations exceed monthly savings. Projections will assume additional funding is available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>

        </div>


        <div className="space-y-2 h-full">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Net Worth Trajectory</CardTitle>
                <CardDescription>{showProjections ? 'History + 10-year projection' : 'Historical records only'}</CardDescription>
              </div>
              <button
                onClick={() => setShowProjections(p => !p)}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${showProjections
                  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400 hover:bg-blue-500/25'
                  : 'bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted/70'
                  }`}
              >
                <TrendingUp className="size-3" />
                {showProjections ? 'Projections On' : 'History Only'}
              </button>
            </CardHeader>
            <CardContent className="flex-1  w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={showProjections ? chartData : chartData.filter(d => d.isHistory)} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
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
                    tickFormatter={(val) => `R ${val >= 1000000 ? (val / 1000000).toFixed(1) + 'M' : (val / 1000).toFixed(0) + 'k'}`}
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
                                <span className="font-mono font-bold">R {(data.investments || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs items-center">
                                <div className="flex items-center gap-2">
                                  <div className="size-2 rounded-full bg-purple-500" />
                                  <span className="text-muted-foreground">Goals</span>
                                </div>
                                <span className="font-mono font-bold">R {(data.goals || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs items-center">
                                <div className="flex items-center gap-2">
                                  <div className="size-2 rounded-full bg-green-500" />
                                  <span className="text-muted-foreground">Savings</span>
                                </div>
                                <span className="font-mono font-bold">R {(data.cash || 0).toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between text-xs items-center opacity-50">
                                <div className="flex items-center gap-2">
                                  <div className="size-2 rounded-full bg-red-500" />
                                  <span className="text-muted-foreground">Debt</span>
                                </div>
                                <span className="font-mono font-bold">- R {(data.debt || 0).toLocaleString()}</span>
                              </div>
                              <div className="pt-2 mt-2 border-t border-white/10 flex justify-between items-center">
                                <span className="text-xs font-black text-primary uppercase">Net Worth</span>
                                <span className="text-sm font-black text-primary">R {data.netWorth.toLocaleString()}</span>
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
                  <span className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Projected Gain</span>
                  <span className="text-xl font-bold text-green-500">+ R {(projectionTarget - currentNetWorth).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
