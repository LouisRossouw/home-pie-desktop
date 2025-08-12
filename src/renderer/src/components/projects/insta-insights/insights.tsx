import { useMemo } from 'react'

import { Social } from '@shared/types'

import { SocialGraph } from '../time-in-progress/social-graph'
import { AccountsDataWithPic } from '.'
import { useOutletContext } from 'react-router'

type InsightsContext = {
  account?: string
  data: AccountsDataWithPic[]
  isPending: boolean
}

export function Insights() {
  const { account, data } = useOutletContext<InsightsContext>()

  const acc = useMemo(() => {
    if (!data || !account) return undefined

    const filtered = data.filter((a) => a.account === account)[0]

    if (filtered) {
      return {
        data: { ...filtered },
        history: filtered.history
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
        <SocialGraph title={'Instagram'} data={acc} />
      </div>
    </div>
  )
}
