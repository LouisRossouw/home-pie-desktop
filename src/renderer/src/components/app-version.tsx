import { getAppVersion } from '@shared/constants'
import { cn } from '~/libs/utils/cn'
import { AnimatedWords } from './animated-words'

const version = getAppVersion()

export function AppVersion({
  animateWords,
  animateWordsOptions = { speed: 70, trailCount: 20, delay: 0 },
  className
}: {
  animateWords?: boolean
  animateWordsOptions?: { speed: number; trailCount: number; delay: number }
  className?: string
}) {
  return (
    <>
      {animateWords ? (
        <AnimatedWords
          speed={animateWordsOptions.speed}
          trailCount={animateWordsOptions.trailCount}
          delay={animateWordsOptions.delay}
          text={`${version} (Alpha)`}
          className={className}
        />
      ) : (
        // {/* VERSION SEMANTICS; V - MAJOR - MINOR - PATCH */}
        <p className={cn('text-light text-xs', className)}>v{version} (Alpha)</p>
      )}
    </>
  )
}
