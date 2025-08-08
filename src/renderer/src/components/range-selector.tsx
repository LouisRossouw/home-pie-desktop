import { useSearchParams } from 'react-router'

import { Range } from '@shared/types'

import {
  Select,
  SelectItem,
  SelectValue,
  SelectGroup,
  SelectContent,
  SelectTrigger
} from '~/components/ui/select'

const rangeOptions = [
  { label: 'Hour', slug: 'hour' },
  { label: 'Day', slug: 'day' },
  { label: 'Week', slug: 'week' },
  { label: 'Month', slug: 'month' },
  { label: 'Year', slug: 'year' }
]

export function RangeSelector({ selected }: { selected: Range }) {
  const [searchParams, setSearchParams] = useSearchParams()

  function handleRangeChange(value: Range) {
    const sp = new URLSearchParams(searchParams)

    sp.set('range', value)
    setSearchParams(sp)
  }

  return (
    <Select defaultValue={selected} onValueChange={(value: Range) => handleRangeChange(value)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a time frame" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectGroup>
          {rangeOptions.map((item) => {
            return (
              <SelectItem key={item.label} value={item.slug}>
                {item.label}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
