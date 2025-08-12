import { useMemo } from 'react'
import { Outlet } from 'react-router'
import { Edit2, RefreshCcw, Server } from 'lucide-react'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import { RangeSelector } from '~/components/range-selector'
import { LoadingIndicator } from '~/components/loading-indicator'
import { IntervalSelector } from '~/components/interval-selector'
import { AccountsDataWithPic } from '.'

export function InstaInsightsLayout({
  selectedAccount,
  isFetching,
  isPending,
  interval,
  refetch,
  data,
  range,
  dbTime
}: any) {
  const currentData = data?.currentData
  const historicData = data?.historicData

  const accountsDataWithPic = useMemo(() => {
    if (!currentData || !historicData || historicData?.length === 0) return currentData

    // Create a new array with additional history data
    const updatedAccounts = currentData.map((account) => {
      let matchedHistory = null

      for (const history of historicData) {
        if (history.length > 0) {
          const lastItem = history[history.length - 1]
          if (lastItem.name === account.account) {
            matchedHistory = history
            return {
              ...account,
              profile_picture_url: lastItem.profile_picture_url,
              history: matchedHistory
            }
          }
        }
      }

      return { ...account, history: [] }
    })

    // Sort accounts by `followers_difference` in descending order (highest first)
    updatedAccounts.sort((a, b) => (b.followers_difference || 0) - (a.followers_difference || 0))

    return updatedAccounts
  }, [currentData, historicData]) as AccountsDataWithPic[]

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
          <ProjectTools handleOpenEditMenu={() => console.log('todo')} />
        </div>
        <div className="flex gap-4 items-center">
          <RangeSelector selected={range} />
          <IntervalSelector currentValue={interval} className="w-32" />
          {dbTime && (
            <div className="flex gap-2 text-xs">
              <Server size={14} />
              <p>{dbTime.toFixed(2)}</p>
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

function ProjectTools({ handleOpenEditMenu }: { handleOpenEditMenu: () => void }) {
  return (
    <Button variant={'ghost'} size={'icon'} onClick={handleOpenEditMenu}>
      <Edit2 size={18} />
    </Button>
  )
}
