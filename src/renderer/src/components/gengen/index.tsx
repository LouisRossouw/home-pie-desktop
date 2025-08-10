import { useSearchParams } from 'react-router'
import { getAllSearchParams } from '~/libs/utils/search-params'

export function GenGenOverview() {
  // const [searchParams] = useSearchParams()

  // const SP = getAllSearchParams(searchParams)

  // const intent = SP.intent

  return (
    <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center">
      <div className="text-center">
        <h2>GenGen Overview</h2>
        <p className="text-xs">* To show an overview of all Generated stuff **</p>
      </div>
    </div>
  )
}
