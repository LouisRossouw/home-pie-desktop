import { useMemo } from 'react'
import { Outlet, useSearchParams } from 'react-router'
import { Edit2, Eye, EyeClosed, RefreshCcw, Server } from 'lucide-react'

import { AccountsDataWithPic, ApiInstaInsightsAccount, Range } from '@shared/types'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { TooltipInfo } from '~/components/tooltip-info'
import { RangeSelector } from '~/components/range-selector'
import { LoadingIndicator } from '~/components/loading-indicator'
import { IntervalSelector } from '~/components/interval-selector'

import { AddAccountDialog } from './add-account-dialog'
// TODO
// type Data = {
//   currentData: SocialData
//   historicData: SocialData[]
//   dbTime: string
// }

type Props = {
  selectedAccount?: string
  accountsRaw?: ApiInstaInsightsAccount[]
  isFetching: boolean
  isPending: boolean
  interval: number
  refetch: () => void
  dbTime?: string
  range: Range
  data?: any
}

export function InstaInsightsLayout({
  selectedAccount,
  accountsRaw,
  isFetching,
  isPending,
  interval,
  refetch,
  data,
  range
}: Props) {
  const currentData = data?.currentData
  const historicData = data?.historicData

  const accountsDataWithPic = useMemo(() => {
    if (!currentData || !historicData || historicData?.length === 0) return currentData

    // Create updated accounts from current + historic data
    let updatedAccounts = currentData.map((account) => {
      let matchedHistory = null

      for (const data of historicData) {
        if (data.length > 0) {
          const lastItem = data[data.length - 1]

          if (lastItem.name === account.account) {
            matchedHistory = data

            return {
              ...account,
              profile_picture_url: lastItem.profile_picture_url,
              historical: matchedHistory
            }
          }
        }
      }

      return { ...account, historical: [] }
    })

    // Merge in "active" from accountsRaw
    updatedAccounts = updatedAccounts.map((acc) => {
      const match = accountsRaw?.find((raw) => raw.account === acc.account)

      return {
        ...acc,
        active: match ? match.active : acc.account === 'time.in.progress' // Time in progress needs to always be true
      }
    })

    // Add any accounts from accountsRaw that are inactive and missing
    accountsRaw?.forEach((raw) => {
      const exists = updatedAccounts.some((acc) => acc.account === raw.account)
      if (!exists && raw.active === false) {
        updatedAccounts.push({
          account: raw.account,
          active: false,
          historical: [],
          profile_picture_url: null
        })
      }
    })

    // Sort by most followers difference.
    updatedAccounts.sort((a, b) => {
      if (a.active && !b.active) return -1
      if (!a.active && b.active) return 1
      return (b.followers_difference || 0) - (a.followers_difference || 0)
    })

    return updatedAccounts
  }, [currentData, historicData, accountsRaw]) as AccountsDataWithPic[]

  if (isPending) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <LoadingIndicator />
      </div>
    )
  }

  if (!isPending && !data) {
    return (
      <div className="flex w-full h-full items-center justify-center">
        <p>Something went wrong..</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full p-4 space-y-4 animate-in fade-in duration-800 ease-in-out">
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-2">
          <Label className="text-lg text-bold text-foreground">
            Insta Insights {selectedAccount ? ` - ${selectedAccount}` : ''}
          </Label>
          <InstaInsightsTools handleOpenEditMenu={() => console.log('todo')} />
        </div>
        <div className="flex gap-4 items-center">
          <RangeSelector selected={range} />
          <IntervalSelector currentValue={interval} className="w-32" />
          {data.dbTime && (
            <div className="flex gap-2 text-xs">
              <Server size={14} />
              <p>{data.dbTime.toFixed(2)}</p>
            </div>
          )}
          <Button variant={'outline'} size={'icon'} onClick={() => refetch()}>
            {isFetching ? <LoadingIndicator /> : <RefreshCcw />}
          </Button>
        </div>
      </div>
      <div>
        <Outlet context={{ account: selectedAccount, data: accountsDataWithPic }} />
      </div>
    </div>
  )
}

function InstaInsightsTools({ handleOpenEditMenu }: { handleOpenEditMenu: () => void }) {
  const [searchParams, setSearchParams] = useSearchParams()

  function handleVisibleChange(value: boolean) {
    const sp = new URLSearchParams(searchParams)

    sp.set('active-accounts-only', String(value))
    setSearchParams(sp)
  }

  const activeAccountsOnly = searchParams.get('active-accounts-only') !== 'false'

  return (
    <>
      <Button variant={'ghost'} size={'icon'} onClick={handleOpenEditMenu}>
        <Edit2 size={18} />
      </Button>

      <TooltipInfo content="Add Account" children={<AddAccountDialog />} />
      <TooltipInfo
        content={activeAccountsOnly ? 'Show all accounts' : 'Only show active accounts'}
        children={
          <Button
            size={'icon'}
            variant={'outline'}
            onClick={() => handleVisibleChange(activeAccountsOnly ? false : true)}
          >
            {activeAccountsOnly ? <EyeClosed size={18} /> : <Eye size={18} />}
          </Button>
        }
      />
    </>
  )
}
