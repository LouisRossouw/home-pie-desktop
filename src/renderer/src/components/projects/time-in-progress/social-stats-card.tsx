import { ArrowDown, ArrowRightLeft, ArrowUp } from 'lucide-react'

import { Label } from '~/components/ui/label'
import { cn } from '~/libs/utils/cn'
import { formatCount } from '../yt-insights/format-count'

// TODO; Move this to /components

export function SocialStatsCard({
  title,
  value,
  disableIndicator = false,
  className
}: {
  title: string
  value: number
  disableIndicator?: boolean
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex w-full p-2 items-center justify-center border rounded-lg shadow',
        className
      )}
    >
      <div className="relative w-full">
        <div className="flex justify-center">
          <Label className="text-xs">{title}</Label>
        </div>
        <div className="flex w-full justify-center items-center">
          <Label className="text-xs sm:text-lg">{value ? formatCount(value) : '-'}</Label>
          {!disableIndicator && (
            <SocialIndicator value={value} className="absolute left-0 top-0 mr-0" />
          )}
        </div>
      </div>
    </div>
  )
}

export function SocialIndicator({ value, className }: { value: number; className?: string }) {
  return (
    <span className={className}>
      {value > 0 && <ArrowUp color="lime" size={14} />}
      {value < 0 && <ArrowDown color="red" size={14} />}
      {value === 0 && <ArrowRightLeft color="yellow" size={14} />}
    </span>
  )
}
