import { Calendar } from 'lucide-react'

interface MonthYearPickerProps {
  selectedMonth: number
  selectedYear: number
  setSelectedMonth: (month: number) => void
  setSelectedYear: (year: number) => void
  monthNames: string[]
  years: number[]
}

export function MonthYearPicker({
  selectedMonth,
  selectedYear,
  setSelectedMonth,
  setSelectedYear,
  monthNames,
  years
}: MonthYearPickerProps) {
  return (
    <div className="flex items-center gap-2 bg-card/40 p-1.5 rounded-xl border border-primary/10">
      <Calendar className="size-4 text-primary ml-2" />
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
        className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
      >
        {monthNames.map((m, i) => (
          <option key={m} value={i} className="bg-background text-foreground">
            {m}
          </option>
        ))}
      </select>
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
        className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer"
      >
        {years.map((y) => (
          <option key={y} value={y} className="bg-background text-foreground">
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}
