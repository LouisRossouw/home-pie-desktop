import { getAppName } from '@shared/constants'

import { cn } from '~/libs/utils/cn'
import { capitalize } from '~/libs/utils/utils'

export function Logo({
  toLowerCapitalize,
  className
}: {
  toLowerCapitalize?: boolean
  className?: string
}) {
  return (
    <p className={cn('hue-rotate-animation', className)}>
      {toLowerCapitalize ? capitalize(getAppName.toLowerCase()) : getAppName}
    </p>
  )
}
