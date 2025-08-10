import { useEffect, useState } from 'react'

type Props = {
  textLeft: string
  textRight: string
  percentage: number
  decimal: number | undefined
  colorStart: string
  colorEnd: string
}

export function ProgressBar({
  textLeft,
  textRight,
  percentage,
  decimal,
  colorStart,
  colorEnd
}: Props) {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDone(true)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  const percentFormatted = decimal
    ? parseFloat(percentage.toFixed(decimal))
    : parseFloat(percentage.toFixed(6))

  const gradientStyle = {
    background: `linear-gradient(to right, ${colorStart}, ${colorEnd})`,
    width: `${percentage}%`,
    borderRadius: 4,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    transition: 'width 2s ease-in-out' // Add CSS transition for width
    // opacity: 0.4,
  }

  return (
    <div className="w-full items-center ">
      <div className="relative w-full h-10 rounded-[12px] shadow border-[0.5px] border-barsBorder p-2 hover:border-teal-200">
        {done && (
          <div className="absolute flex h-full w-full justify-between items-center animate-fade -m-2 px-2">
            <p className="flex-1 text-txt text-left pl-1 text-xs">{textLeft}</p>
            <p className="flex-1 text-txt-foreground text-center text-sm">{percentFormatted} %</p>
            <p className="flex-1 text-txt text-right text-xs pr-1">{textRight}</p>
          </div>
        )}

        <div style={gradientStyle}></div>
      </div>
    </div>
  )
}
