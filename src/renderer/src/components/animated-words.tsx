import { useAnimatedText } from '~/libs/hooks/use-animated-text'
import { cn } from '~/libs/utils/cn'

export function AnimatedWords({
  text,
  trailCount = 5,
  speed = 80,
  delay = 0,
  className
}: {
  text: string
  trailCount?: number
  speed?: number
  delay?: number
  className?: string
}) {
  const ref = useAnimatedText(text, { trailCount, speed, delay })

  return <div ref={ref} className={cn('inline-block text-foreground', className)} />
}
