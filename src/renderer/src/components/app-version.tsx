import { cn } from '~/libs/utils/cn'

export function AppVersion({ className }: { className?: string }) {
  return <p className={cn('text-light text-xs', className)}>v0.0.0 (Alpha)</p>
}
