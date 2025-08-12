import { useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'

import { Range, SocialData } from '@shared/types'

import { getAllSearchParams } from '~/libs/utils/search-params'

import { InstaInsightsLayout } from './layout'

const fiveMin = 1000 * 60 * 5

export type AccountsDataWithPic = SocialData & { profile_picture_url: string; history: any[] }

export function InstaInsights() {
  const [searchParams] = useSearchParams()
  const { account: maybeSelectedAccount } = useParams()

  const SP = getAllSearchParams(searchParams)

  const range = SP.range ?? 'hour'
  const interval = SP.interval ?? 12 // 1 Hour

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
    queryKey: ['insta-insights-accounts-data', { range, interval }],
    queryFn: () =>
      apiGetAccountsOverview({
        platform: 'instagram',
        accounts: accounts,
        interval,
        range
      }),
    staleTime: fiveMin,
    refetchInterval: fiveMin,
    enabled: accounts?.length > 0
  })

  const dbTime = data?.db_elapsed_time

  return (
    <InstaInsightsLayout
      data={data}
      range={range}
      dbTime={dbTime}
      refetch={refetch}
      interval={interval}
      isPending={isPending}
      isFetching={isFetching}
      selectedAccount={maybeSelectedAccount}
    />
  )
}

async function getAllAccounts() {
  const { data } = await window.api.apiInstaInsightsGetAllAccounts()

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
  const { current_data, historic_data, db_elapsed_time } =
    await window.api.apiInstaInsightsGetAccountsOverview({
      accounts,
      range,
      interval,
      platform
    })

  return { currentData: current_data ?? [], historicData: historic_data ?? [], db_elapsed_time }
}
