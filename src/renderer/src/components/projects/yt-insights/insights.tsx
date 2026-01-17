import { useMemo } from 'react'
import { useOutletContext } from 'react-router'

import type { AccountsDataWithPic, Social } from '@shared/types'

import { SocialGraph } from '../time-in-progress/social-graph'

type YTContext = {
  account?: string
  data: AccountsDataWithPic[]
  isPending: boolean
}

export function Insights() {
  const { account, data } = useOutletContext<YTContext>()

  const acc = useMemo(() => {
    if (!data || !account) return undefined

    const filtered = data.filter((a) => a.account === account)[0]

    if (filtered) {
      return {
        data: { ...filtered },
        historical: filtered.historical
      }
    }

    return undefined
  }, [account, data]) as Social | undefined

  if (!acc) {
    return (
      <div className="flex w-full h-[calc(100vh-96px)] justify-center">
        <div className="flex w-full h-[calc(100%-100px)] items-center justify-center">
          <h3>No Account..</h3>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full h-[calc(100vh-96px)] justify-center">
      <div className="flex w-full h-[calc(100%-100px)]">
        <SocialGraph title={'YouTube'} data={acc} />
      </div>
    </div>
  )
}
