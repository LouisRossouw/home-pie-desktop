import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { FinanceData, ApiFinanceRecord } from '@shared/types'


const defaultFinanceData: FinanceData = {
  income: 0, // legacy
  incomeSources: [
    { id: '1', label: 'Primary Income', amount: 0 }
  ],
  taxRate: 25,
  expenses: [
    { id: '1', label: 'Food', amount: 0 },
    { id: '2', label: 'Subscriptions', amount: 0 }
  ],
  assets: [
    { id: 'stocks', label: 'Stocks', value: 100000, growth: 7, allocation: 5000 },
    { id: 'crypto', label: 'Crypto', value: 10000, growth: 20, allocation: 1000 },
    { id: 'cash', label: 'Cash', value: 50000, growth: 4, allocation: 2000 }
  ],
  savingGoals: [],
  debt: 0, // legacy
  debts: [],
  growthRate: 5
}


export type FinanceRecord = {
  month: number
  year: number
  data: FinanceData
}

const sanitizeFinanceData = (data: any): FinanceData => {
  if (!data) return defaultFinanceData
  const sanitized = { ...defaultFinanceData, ...data }
  
  // Migration: If assets array doesn't exist, migrate from old hardcoded fields
  if (!sanitized.assets || !Array.isArray(sanitized.assets)) {
    sanitized.assets = [
      { 
        id: 'stocks', 
        label: 'Stocks', 
        value: sanitized.stocks ?? 0, 
        growth: sanitized.stocksGrowth ?? 7, 
        allocation: sanitized.stocksAllocation ?? 0 
      },
      { 
        id: 'crypto', 
        label: 'Crypto', 
        value: sanitized.crypto ?? 0, 
        growth: sanitized.cryptoGrowth ?? 20, 
        allocation: sanitized.cryptoAllocation ?? 0 
      },
      { 
        id: 'cash', 
        label: 'Cash', 
        value: sanitized.cash ?? 0, 
        growth: sanitized.cashGrowth ?? 4, 
        allocation: sanitized.cashAllocation ?? 0 
      }
    ]
  }

  if (!sanitized.savingGoals || !Array.isArray(sanitized.savingGoals)) {
    sanitized.savingGoals = []
  }

  // Migration: debts array from legacy debt number
  if (!sanitized.debts || !Array.isArray(sanitized.debts)) {
    sanitized.debts = []
    // If there's a legacy debt value, migrate it
    if (sanitized.debt && sanitized.debt > 0) {
      const now = new Date()
      sanitized.debts = [{
        id: 'legacy-debt',
        label: 'Legacy Debt',
        totalAmount: sanitized.debt,
        monthlyAllocation: 0,
        interestRate: 0,
        startMonth: now.getMonth(),
        startYear: now.getFullYear()
      }]
    }
  } else {
    // Migrate old debt items that have remainingAmount/totalPaid to new structure
    sanitized.debts = sanitized.debts.map((d: any) => {
      if (d.startMonth === undefined || d.startYear === undefined) {
        const now = new Date()
        return {
          ...d,
          startMonth: d.startMonth ?? now.getMonth(),
          startYear: d.startYear ?? now.getFullYear()
        }
      }
      return d
    })
  }

  if (typeof sanitized.expenses === 'number') {
    sanitized.expenses = [
      { id: 'legacy-expenses', label: 'Previous Expenses', amount: sanitized.expenses }
    ]
  }
  
  // Migration: incomeSources from legacy income number
  if (!sanitized.incomeSources || !Array.isArray(sanitized.incomeSources) || sanitized.incomeSources.length === 0) {
    sanitized.incomeSources = [
      { id: 'legacy-income', label: 'Primary Income', amount: sanitized.income ?? 0 }
    ]
  }

  sanitized.taxRate = sanitized.taxRate ?? defaultFinanceData.taxRate
  sanitized.growthRate = sanitized.growthRate ?? defaultFinanceData.growthRate
  
  return sanitized as FinanceData
}


export function useFinances(month?: number, year?: number) {
  const queryClient = useQueryClient()

  // Fetch all historical records
  const { data: records = [], isLoading: isLoadingRecords } = useQuery({
    queryKey: ['finance-records'],
    queryFn: async () => {
      const data = await window.api.external.apiGetFinanceRecords()
      return (data || []).map((r: ApiFinanceRecord) => ({
        ...r,
        data: sanitizeFinanceData(r.value)
      })) as FinanceRecord[]
    }
  })

  // Fetch current or specific month settings
  const { data: finances, isLoading } = useQuery({
    queryKey: ['finances', month, year],
    queryFn: async () => {
      if (month !== undefined && year !== undefined) {
        const record = await window.api.external.apiGetFinanceRecord({ month, year })
        if (record) return sanitizeFinanceData(record)
      }
      const data = await window.api.external.apiGetFinanceSetting('main')
      return sanitizeFinanceData(data)
    }
  })

  const saveFinances = useMutation({
    mutationFn: async (newData: FinanceData) => {
      if (month !== undefined && year !== undefined) {
        await window.api.external.apiSetFinanceRecord({ month, year, value: newData })
      }
      // Always update "latest" as current default
      await window.api.external.apiSetFinanceSetting({ key: 'main', value: newData })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['finances'] })
      queryClient.invalidateQueries({ queryKey: ['finance-records'] })
    }
  })

  return {
    finances,
    records,
    isLoading: isLoading || isLoadingRecords,
    saveFinances: saveFinances.mutate,
    isSaving: saveFinances.isPending
  }
}
