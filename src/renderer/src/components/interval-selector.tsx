import { useSearchParams } from 'react-router'

import { Input } from '~/components/ui/input'

export function IntervalSelector({
  currentValue,
  className
}: {
  currentValue: number
  className?: string
}) {
  const [searchParams, setSearchParams] = useSearchParams()

  function handleIntervalChange(value: any) {
    const sp = new URLSearchParams(searchParams)

    sp.set('interval', value)
    setSearchParams(sp)
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
