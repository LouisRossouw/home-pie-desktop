import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Input } from '~/components/ui/input'
import { useDebounce } from '~/libs/hooks/use-debounce'

export function IntervalSelector({
  currentValue,
  className
}: {
  currentValue: number
  className?: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  const [pendingInterval, setPendingInterval] = useState<string | number>(currentValue)

  const debouncedRange = useDebounce(pendingInterval, 2000)

  useEffect(() => {
    const sp = new URLSearchParams(searchParams)
    sp.set('interval', String(debouncedRange))
    setSearchParams(sp)
  }, [debouncedRange, searchParams, setSearchParams])

  function handleIntervalChange(value: string) {
    setPendingInterval(value)
  }

  return (
    <Input
      type="number"
      className={className}
      defaultValue={currentValue}
      onChange={(e) => handleIntervalChange(e.currentTarget.value)}
    />
  )
}
