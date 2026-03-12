import { useState, useMemo, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'

import { FinanceData, IncomeItem, AssetItem, SavingGoal, DebtItem } from '@shared/types'

import { useFinances } from '~/libs/hooks/use-finances'

import { Button } from '~/components/ui/button'

import { DebtSection } from './overview/debt-section'
import { GoalsSection } from './overview/goals-section'
import { SummaryCards } from './overview/summary-cards'
import { ChartSection } from './overview/chart-section'
import { IncomeSection } from './overview/income-section'
import { AssetsSection } from './overview/assets-section'
import { ExpensesSection } from './overview/expenses-section'
import { MonthYearPicker } from '../month-year-picker'

export function MyFinancesOverview() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [formData, setFormData] = useState<FinanceData | null>(null)
  const [showProjections, setShowProjections] = useState(true)
  const [isExpensesOpen, setIsExpensesOpen] = useState(false)
  const [isIncomeOpen, setIsIncomeOpen] = useState(false)
  const [isAssetsOpen, setIsAssetsOpen] = useState(false)
  const [isGoalsOpen, setIsGoalsOpen] = useState(false)
  const [isDebtsOpen, setIsDebtsOpen] = useState(false)
  const [hideValues, setHideValues] = useState(false)

  const { finances, records, saveFinances, isSaving } = useFinances(selectedMonth, selectedYear)

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
        expenses: prev.expenses.map((e) => (e.id === id ? { ...e, label, amount: numAmount } : e))
      }
    })
  }

  const handleIncomeSourceChange = (id: string, field: keyof IncomeItem, value: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        incomeSources: prev.incomeSources.map((s) => {
          if (s.id !== id) return s
          if (field === 'taxRate') {
            // Allow clearing the field to revert to global rate
            const parsed = value === '' ? undefined : (parseFloat(value) ?? undefined)
            return { ...s, taxRate: parsed }
          }
          return { ...s, [field]: field === 'amount' ? parseFloat(value) || 0 : value }
        })
      }
    })
  }

  const addIncomeSource = () => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        incomeSources: [
          ...prev.incomeSources,
          { id: crypto.randomUUID(), label: 'New Source', amount: 0 }
        ]
      }
    })
  }

  const removeIncomeSource = (id: string) => {
    setFormData((prev) => {
      if (!prev) return null
      if (prev.incomeSources.length <= 1) return prev // keep at least one
      return {
        ...prev,
        incomeSources: prev.incomeSources.filter((s) => s.id !== id)
      }
    })
  }

  const addExpense = () => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        expenses: [...prev.expenses, { id: crypto.randomUUID(), label: 'New Expense', amount: 0 }]
      }
    })
  }

  const removeExpense = (id: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        expenses: prev.expenses.filter((e) => e.id !== id)
      }
    })
  }

  const handleAssetChange = (id: string, field: keyof AssetItem, value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) || 0 : value
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assets: prev.assets.map((a) => (a.id === id ? { ...a, [field]: numValue } : a))
      }
    })
  }

  const addAsset = () => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assets: [
          ...prev.assets,
          { id: crypto.randomUUID(), label: 'New Asset', value: 0, growth: 5, allocation: 0 }
        ]
      }
    })
  }

  const removeAsset = (id: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        assets: prev.assets.filter((a) => a.id !== id)
      }
    })
  }

  const handleGoalChange = (id: string, field: keyof SavingGoal, value: string | number) => {
    const val = field === 'label' ? value : parseFloat(value.toString()) || 0
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: prev.savingGoals.map((g) => (g.id === id ? { ...g, [field]: val } : g))
      }
    })
  }

  const addGoal = () => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11)
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: [
          ...prev.savingGoals,
          { id, label: 'New Goal', targetAmount: 5000, currentAmount: 0, monthlyAllocation: 500 }
        ]
      }
    })
  }

  const removeGoal = (id: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        savingGoals: prev.savingGoals.filter((g) => g.id !== id)
      }
    })
  }

  const handleDebtChange = (id: string, field: keyof DebtItem, value: string | number) => {
    const val = field === 'label' ? value : parseFloat(value.toString()) || 0
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        debts: (prev.debts || []).map((d) => (d.id === id ? { ...d, [field]: val } : d))
      }
    })
  }

  const addDebt = () => {
    const id =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : Math.random().toString(36).substring(2, 11)
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        debts: [
          ...(prev.debts || []),
          {
            id,
            label: 'New Debt',
            totalAmount: 0,
            monthlyAllocation: 0,
            interestRate: 0,
            startMonth: selectedMonth,
            startYear: selectedYear
          }
        ]
      }
    })
  }

  const removeDebt = (id: string) => {
    setFormData((prev) => {
      if (!prev) return null
      return {
        ...prev,
        debts: (prev.debts || []).filter((d) => d.id !== id)
      }
    })
  }

  const handleSave = () => {
    if (formData) {
      saveFinances(formData)
    }
  }

  // Helper function to calculate debt remaining and paid amounts
  const calculateDebtProgress = (debt: DebtItem, currentMonth: number, currentYear: number) => {
    // Calculate months elapsed since start
    const monthsElapsed = (currentYear - debt.startYear) * 12 + (currentMonth - debt.startMonth)

    if (monthsElapsed <= 0) {
      return {
        remainingAmount: debt.totalAmount,
        totalPaid: 0,
        monthsElapsed: 0
      }
    }

    // Calculate with compound interest
    let remaining = debt.totalAmount
    let totalPaid = 0
    const monthlyInterestRate = debt.interestRate / 100 / 12

    for (let i = 0; i < monthsElapsed; i++) {
      // Apply interest
      const interest = remaining * monthlyInterestRate
      remaining += interest

      // Apply payment
      const payment = Math.min(debt.monthlyAllocation, remaining)
      remaining -= payment
      totalPaid += payment

      if (remaining <= 0) {
        remaining = 0
        break
      }
    }

    return {
      remainingAmount: Math.max(0, remaining),
      totalPaid,
      monthsElapsed
    }
  }

  const totals = useMemo(() => {
    if (!formData)
      return {
        tax: 0,
        netIncome: 0,
        totalExpenses: 0,
        monthlySavings: 0,
        totalAllocations: 0,
        assetAllocations: 0,
        goalAllocations: 0,
        debtAllocations: 0,
        totalDebt: 0,
        grossIncome: 0
      }

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
    const goalAllocations = (formData.savingGoals || []).reduce(
      (sum, g) => sum + g.monthlyAllocation,
      0
    )
    const debtAllocations = (formData.debts || []).reduce((sum, d) => sum + d.monthlyAllocation, 0)
    const totalAllocations = assetAllocations + goalAllocations + debtAllocations
    // Calculate total remaining debt using the helper function
    const totalDebt = (formData.debts || []).reduce((sum, d) => {
      const { remainingAmount } = calculateDebtProgress(d, selectedMonth, selectedYear)
      return sum + remainingAmount
    }, 0)

    return {
      tax,
      netIncome,
      totalExpenses,
      monthlySavings,
      totalAllocations,
      assetAllocations,
      goalAllocations,
      debtAllocations,
      totalDebt,
      grossIncome
    }
  }, [formData, selectedMonth, selectedYear])

  // Previous month's saved record for MoM comparison
  const prevMonthSavings = useMemo(() => {
    const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
    const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear
    const rec = records.find((r) => r.month === prevMonth && r.year === prevYear)
    if (!rec) return null
    const d = rec.data
    const grossIncome = (d.incomeSources || []).reduce((s, src) => s + src.amount, d.income ?? 0)
    const tax = (d.incomeSources || [{ id: '', label: '', amount: d.income ?? 0 }]).reduce(
      (sum, s) => {
        const rate = s.taxRate !== undefined ? s.taxRate : d.taxRate
        return sum + s.amount * (rate / 100)
      },
      0
    )
    const netIncome = grossIncome - tax
    const totalExpenses = (Array.isArray(d.expenses) ? d.expenses : []).reduce(
      (s, e) => s + e.amount,
      0
    )
    return netIncome - totalExpenses
  }, [records, selectedMonth, selectedYear])

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  const chartData = useMemo(() => {
    if (!formData) return []

    const data: any[] = []

    // 1. Process Historical Records
    const sortedRecords = [...records].sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year
      return a.month - b.month
    })

    sortedRecords.forEach((r) => {
      const assetNW = r.data.assets.reduce((sum, a) => sum + a.value, 0)
      // Calculate total debt for this historical record
      const totalDebt =
        (r.data.debts || []).reduce((sum, d) => {
          const { remainingAmount } = calculateDebtProgress(d, r.month, r.year)
          return sum + remainingAmount
        }, 0) ||
        r.data.debt ||
        0
      const currentNW = assetNW - totalDebt
      data.push({
        label: `${monthNames[r.month]} ${r.year}`,
        netWorth: currentNW,
        investments: currentNW,
        goals: 0,
        cash: 0,
        debt: totalDebt,
        isHistory: true
      })
    })

    // 2. Generate Projections (10 Years from now)
    const years = 10
    const months = years * 12

    const gSavings = 1 + formData.growthRate / 100 / 12

    // Initialize asset tracking
    let currentAssets = formData.assets.map((a) => ({ ...a, currentValue: a.value }))
    let currentGoals = (formData.savingGoals || []).map((g) => ({
      ...g,
      currentSimulatedAmount: g.currentAmount
    }))
    // Initialize debts with their current remaining amounts
    let currentDebts = (formData.debts || []).map((d) => {
      const { remainingAmount, totalPaid } = calculateDebtProgress(d, selectedMonth, selectedYear)
      return { ...d, currentRemaining: remainingAmount, currentTotalPaid: totalPaid }
    })

    const assetAllocations = formData.assets.reduce((sum, a) => sum + a.allocation, 0)
    let currentSavingsPool = 0

    for (let i = 1; i <= months; i++) {
      // Calculate goal allocations for this month
      let activeGoalAllocations = 0
      currentGoals = currentGoals.map((g) => {
        if (g.currentSimulatedAmount < g.targetAmount) {
          const allocation = Math.min(
            g.monthlyAllocation,
            g.targetAmount - g.currentSimulatedAmount
          )
          activeGoalAllocations += allocation
          return { ...g, currentSimulatedAmount: g.currentSimulatedAmount + allocation }
        }
        return g
      })

      // Calculate debt payments with interest for this month
      let activeDebtAllocations = 0
      currentDebts = currentDebts.map((d) => {
        if (d.currentRemaining > 0) {
          // Apply monthly interest first
          const monthlyInterest = d.currentRemaining * (d.interestRate / 100 / 12)
          const remainingWithInterest = d.currentRemaining + monthlyInterest

          // Apply payment
          const payment = Math.min(d.monthlyAllocation, remainingWithInterest)
          activeDebtAllocations += d.monthlyAllocation // allocation is fixed

          return {
            ...d,
            currentRemaining: Math.max(0, remainingWithInterest - payment),
            currentTotalPaid: d.currentTotalPaid + payment
          }
        }
        return d
      })

      const totalAllocations = assetAllocations + activeGoalAllocations + activeDebtAllocations
      const leftoverMonthlySavings = Math.max(0, totals.monthlySavings - totalAllocations)

      // Grow and contribute to each asset
      currentAssets = currentAssets.map((a) => {
        const monthlyGrowth = 1 + a.growth / 100 / 12
        return {
          ...a,
          currentValue: (a.currentValue + a.allocation) * monthlyGrowth
        }
      })

      currentSavingsPool = (currentSavingsPool + leftoverMonthlySavings) * gSavings

      const totalAssetValue = currentAssets.reduce((sum, a) => sum + a.currentValue, 0)
      const totalGoalValue = currentGoals.reduce((sum, g) => sum + g.currentSimulatedAmount, 0)
      const totalDebtRemaining = currentDebts.reduce((sum, d) => sum + d.currentRemaining, 0)
      const totalNetWorth =
        totalAssetValue + totalGoalValue + currentSavingsPool - totalDebtRemaining

      // Push data every 6 months for a smoother but clean graph
      if (i % 6 === 0) {
        data.push({
          label: `+${i / 12}y`,
          netWorth: Math.round(totalNetWorth),
          investments: Math.round(totalAssetValue),
          goals: Math.round(totalGoalValue),
          cash: Math.round(currentSavingsPool),
          debt: Math.round(totalDebtRemaining),
          isHistory: false
        })
      }
    }
    return data
  }, [formData, records, totals])

  if (!formData) return <div className="p-8">Loading...</div>

  const currentNetWorth = formData.assets.reduce((sum, a) => sum + a.value, 0) - totals.totalDebt

  const projectionTarget = chartData[chartData.length - 1]?.netWorth || 0

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i)

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto p-6 space-y-6 bg-background/50 text-foreground">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Financial Portfolio
            </h1>
            <p className="text-muted-foreground text-sm">
              Track history and project future growth.
            </p>
          </div>
          <MonthYearPicker
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            setSelectedMonth={setSelectedMonth}
            setSelectedYear={setSelectedYear}
            monthNames={monthNames}
            years={years}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setHideValues((v) => !v)}
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

      <SummaryCards
        currentNetWorth={currentNetWorth}
        monthlySavings={totals.monthlySavings}
        prevMonthSavings={prevMonthSavings}
        totalExpenses={totals.totalExpenses}
        fiveYearProjection={chartData.find((d) => d.label === '+5y')?.netWorth || 0}
        tenYearProjection={projectionTarget}
        hideValues={hideValues}
        monthNames={monthNames}
        selectedMonth={selectedMonth}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-2">
          <IncomeSection
            isIncomeOpen={isIncomeOpen}
            setIsIncomeOpen={setIsIncomeOpen}
            formData={formData}
            totals={totals}
            hideValues={hideValues}
            addIncomeSource={addIncomeSource}
            removeIncomeSource={removeIncomeSource}
            handleIncomeSourceChange={handleIncomeSourceChange}
            handleInputChange={handleInputChange}
          />

          <ExpensesSection
            isExpensesOpen={isExpensesOpen}
            setIsExpensesOpen={setIsExpensesOpen}
            formData={formData}
            totals={totals}
            addExpense={addExpense}
            removeExpense={removeExpense}
            handleExpenseChange={handleExpenseChange}
          />

          <GoalsSection
            isGoalsOpen={isGoalsOpen}
            setIsGoalsOpen={setIsGoalsOpen}
            formData={formData}
            totals={totals}
            addGoal={addGoal}
            removeGoal={removeGoal}
            handleGoalChange={handleGoalChange}
          />

          <AssetsSection
            isAssetsOpen={isAssetsOpen}
            setIsAssetsOpen={setIsAssetsOpen}
            formData={formData}
            totals={totals}
            addAsset={addAsset}
            removeAsset={removeAsset}
            handleAssetChange={handleAssetChange}
            handleInputChange={handleInputChange}
          />

          <DebtSection
            isDebtsOpen={isDebtsOpen}
            setIsDebtsOpen={setIsDebtsOpen}
            formData={formData}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            totals={totals}
            calculateDebtProgress={calculateDebtProgress}
            addDebt={addDebt}
            removeDebt={removeDebt}
            handleDebtChange={handleDebtChange}
          />
        </div>

        <div className="space-y-2 h-full">
          <ChartSection
            showProjections={showProjections}
            setShowProjections={setShowProjections}
            chartData={chartData}
            projectionTarget={projectionTarget}
            currentNetWorth={currentNetWorth}
          />
        </div>
      </div>
    </div>
  )
}
