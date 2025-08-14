import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { Range } from '@shared/types'

import { getAllSearchParams } from '~/libs/utils/search-params'

import { InstaInsightsLayout } from './layout'

const fiveMin = 1000 * 60 * 5
const platform = 'instagram'

export function InstaInsights() {
  const [searchParams] = useSearchParams()
  const { account: maybeSelectedAccount } = useParams()

  const SP = getAllSearchParams(searchParams)

  const range: Range = SP.range ?? 'hour'
  const interval: number = SP.interval ?? 12 // 1 Hour

  const { data: accountsRaw } = useQuery({
    queryKey: ['insta-insights-all-accounts'],
    queryFn: getAllAccounts,
    staleTime: fiveMin
  })

  const accounts = useMemo(() => {
    if (!accountsRaw) return []

    const filteredAccounts = accountsRaw.filter((acc) => acc.active).map((acc) => acc.account)
    filteredAccounts.push('time.in.progress')

    return filteredAccounts
  }, [accountsRaw])

  const { data, refetch, isPending, isFetching } = useQuery({
    queryKey: ['insta-insights-accounts-data', { accounts, range, interval }],
    queryFn: () => apiGetAccountsOverview({ platform, accounts, interval, range }),
    enabled: accounts?.length > 0,
    refetchInterval: fiveMin,
    staleTime: fiveMin
  })

  return (
    <InstaInsightsLayout
      selectedAccount={maybeSelectedAccount}
      accountsRaw={accountsRaw}
      isFetching={isFetching}
      isPending={isPending}
      interval={interval}
      refetch={refetch}
      dbTime={data?.dbTime}
      range={range}
      data={data}
    />
  )
}

async function getAllAccounts() {
  const { data } = await window.api.external.apiInstaInsightsGetAllAccounts()

  return data ?? []
}

async function apiGetAccountsOverview({
  accounts,
  range,
  interval,
  platform
}: {
  accounts: string[]
  range: Range
  interval: number
  platform: string
}) {
  const res = await window.api.external.apiInstaInsightsGetAccountsOverview({
    accounts,
    range,
    interval,
    platform
  })

  return {
    currentData: res.data ?? [],
    historicData: res.historical ?? [],
    dbTime: res.db_elapsed_time
  }
}
