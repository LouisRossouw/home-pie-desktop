import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { Range } from '@shared/types'

import { getAllSearchParams } from '~/libs/utils/search-params'

import { YTInsightsLayout } from './layout'

const fiveMin = 1000 * 60 * 5
const platform = 'youtube'

export function YouTubeInsights() {
  const [searchParams] = useSearchParams()
  const { account: maybeSelectedAccount } = useParams()

  const SP = getAllSearchParams(searchParams)

  const range: Range = SP.range ?? 'hour'
  const interval: number = SP.interval ?? 12 // 1 Hour

  const {
    data: accountsRaw,
    isPending: isAccountsPending,
    isFetching: isAccountsFetching
  } = useQuery({
    queryKey: ['yt-insights-all-accounts'],
    queryFn: getAllAccounts,
    staleTime: fiveMin
  })

  const accounts = useMemo(() => {
    if (!accountsRaw) return []

    const filteredAccounts = accountsRaw.filter((acc) => acc.active).map((acc) => acc.account)

    return filteredAccounts
  }, [accountsRaw])

  const {
    data,
    refetch,
    isPending: isDataPending,
    isFetching: isDataFetching
  } = useQuery({
    queryKey: ['yt-insights-accounts-data', { accounts: accounts.length, range, interval }],
    queryFn: () => apiGetAccountsOverview({ platform, accounts, interval, range }),
    enabled: accounts?.length > 0,
    refetchInterval: fiveMin,
    staleTime: fiveMin
  })

  return (
    <YTInsightsLayout
      selectedAccount={maybeSelectedAccount}
      accountsRaw={accountsRaw}
      isFetching={isDataFetching || isAccountsFetching}
      isPending={isAccountsPending || isDataPending}
      interval={interval}
      refetch={refetch}
      dbTime={data?.dbTime}
      range={range}
      data={data}
    />
  )
}

async function getAllAccounts() {
  const { data } = await window.api.external.apiYTInsightsGetAllAccounts()

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
  const res = await window.api.external.apiYTInsightsGetAccountsOverview({
    accounts,
    range,
    interval,
    platform
  })

  return {
    currentData: res.data ?? [],
    historicData: res.historical ?? [],
    dbTime: res.dbElapsedTime
  }
}
