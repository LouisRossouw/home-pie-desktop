import { ReactNode } from 'react'
import { ArrowLeft, RefreshCcw } from 'lucide-react'
import { useSearchParams } from 'react-router'

import { Range } from '@shared/types'
import { useNav } from '~/libs/hooks/use-navigation'
import { getAllSearchParams } from '~/libs/utils/search-params'

import { Button } from '~/components/ui/button'
import { RangeSelector } from '~/components/range-selector'
import { IntervalSelector } from '~/components/interval-selector'
import { LoadingIndicator } from '~/components/loading-indicator'

export function EnergyDetailView({
  title,
  children,
  isLoading,
  refetch,
  currentValue,
  unit,
  description
}: {
  title: string
  children: ReactNode
  isLoading: boolean
  refetch: () => void
  currentValue?: string | number
  unit?: string
  description?: string
}) {
  const { navigateTo } = useNav()
  const [searchParams] = useSearchParams()
  const SP = getAllSearchParams(searchParams)

  const range = (SP.range as Range) ?? 'hour'
  const interval = Number(SP.interval ?? 24)

  return (
    <div className="flex flex-col gap-6 p-6 h-full animate-in fade-in duration-300 ease-out transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateTo('/smart-home/energy')}
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ArrowLeft className="size-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tighter uppercase">{title}</h1>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              Detailed Analytics & History
            </p>
          </div>
        </div>
        <div>
          {currentValue !== undefined && (
            <div className="text-right flex flex-col items-end">
              <div className="flex items-baseline gap-1 animate-in zoom-in duration-500 delay-200">
                <span className="text-5xl tracking-tighter">
                  {typeof currentValue === 'number' ? currentValue.toFixed(2) : currentValue}
                </span>
                <span className="text-sm font-black uppercase">{unit}</span>
              </div>
              {description && (
                <p className="text-[10px] uppercase  tracking-widest leading-none">{description}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-background/50 backdrop-blur-sm p-1 rounded-2xl border border-border/50 shadow-sm">
            <RangeSelector selected={range} />
            <IntervalSelector
              currentValue={interval}
              className="w-24 border-none bg-transparent font-bold focus-visible:ring-0"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={refetch}
              className="rounded-xl hover:bg-primary/10 transition-colors"
            >
              {isLoading ? <LoadingIndicator /> : <RefreshCcw className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card/30 backdrop-blur-md rounded-[2.5rem] border border-border/40 shadow-2xl overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-1000" />
        <div className="relative h-full flex flex-col">{children}</div>
      </div>
    </div>
  )
}
