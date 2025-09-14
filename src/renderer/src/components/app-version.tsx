import { getAppVersion } from '@shared/constants'
import { cn } from '~/libs/utils/cn'

const version = getAppVersion()

export function AppVersion({ className }: { className?: string }) {
  return (
    // {/* VERSION SEMANTICS; V - MAJOR - MINOR - PATCH */}
    <p className={cn('text-light text-xs', className)}>v{version} (Alpha)</p>
  )
}
