import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useOutletContext, useSearchParams } from 'react-router'

import { ActivitySquare, DeleteIcon, Pencil } from 'lucide-react'

import type { AccountsDataWithPic, ApiInstaInsightsAccount } from '@shared/types'

import { cn } from '~/libs/utils/cn'

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription
} from '~/components/ui/alert-dialog'

import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator
} from '~/components/ui/dropdown-menu'

import { Label } from '~/components/ui/label'
import { Button } from '~/components/ui/button'
import LineChartCompact from '~/components/line-chart-compact'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

import { SocialIndicator, SocialStatsCard } from '../time-in-progress/social-stats-card'

type InstaInsightsContext = {
  data: AccountsDataWithPic[]
  isPending: boolean
}

type UpdateAccountState = { account: string; active: boolean }

export function InstaInsightsOverview() {
  const { data } = useOutletContext<InstaInsightsContext>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const [accountToRemove, setAccountToRemove] = useState('')

  const { mutate: updateAccountStatus } = useMutation({
    mutationKey: ['update-account-status'],
    mutationFn: async (data: UpdateAccountState) => {
      return await window.api.external.apiInstaInsightsUpdateAccountStatus(data)
    },
    onSettled: async (res) => {
      if (res?.ok) {
        await queryClient.invalidateQueries({ queryKey: ['insta-insights-all-accounts'] })
      }
    }
  })

  const { mutate: removeAccount } = useMutation({
    mutationKey: ['remove-account'],
    mutationFn: async (data: { account: string; active: boolean }) => {
      return await window.api.external.apiInstaInsightsRemoveAccount(data)
    },
    onSettled: async (res) => {
      if (res?.ok) {
        await queryClient.invalidateQueries({ queryKey: ['insta-insights-all-accounts'] })
      }
    }
  })

  const activeAccountsOnly = searchParams.get('active-accounts-only') !== 'false'

  return (
    <>
      <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center pb-20">
        <div className="w-full p-4 overflow-y-scroll h-full">
          {data?.map((account, index) => {
            if (!account.active && activeAccountsOnly) return null
            return (
              <div key={index}>
                <AccountRow
                  account={account}
                  navigate={navigate}
                  setAccountToRemove={setAccountToRemove}
                  updateAccountStatus={updateAccountStatus}
                />
              </div>
            )
          })}
        </div>
      </div>
      <ConfirmRemoveAccountDialog
        accountToRemove={accountToRemove}
        setAccountToRemove={setAccountToRemove}
        removeAccount={removeAccount}
      />
    </>
  )
}

function AccountRow({
  account,
  navigate,
  setAccountToRemove,
  updateAccountStatus
}: {
  account: AccountsDataWithPic
  navigate: (v: string) => void
  setAccountToRemove: (v: string) => void
  updateAccountStatus: (v: UpdateAccountState) => void
}) {
  const accountName = account.account

  function handleNavigate() {
    navigate(`/projects/insta-insights/${accountName}/insights`)
  }

  return (
    <div
      className={cn(
        'flex items-center h-20 gap-4 justify-center  border-b hover:border-accent/50',
        accountName === 'time.in.progress' && 'bg-accent/10'
      )}
    >
      <div className="w-8 ">
        {accountName !== 'time.in.progress' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={'sm'}>
                <Pencil size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Edit {accountName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() => setAccountToRemove(accountName)}
                >
                  Delete
                  <DeleteIcon size={18} />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex justify-between"
                  onClick={() =>
                    updateAccountStatus({ account: accountName, active: !account.active })
                  }
                >
                  {account.active ? 'Deactivate' : 'Activate'}
                  <ActivitySquare size={18} />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div onClick={handleNavigate} className={`flex w-64 hover:cursor-pointer`}>
        <Avatar>
          <AvatarImage src={account.profile_picture_url} alt="NA" />
          <AvatarFallback>NA</AvatarFallback>
        </Avatar>
        <div className="text-white w-full flex items-center justify-start ml-4">
          <Label>{accountName}</Label>
        </div>
      </div>
      <div className="flex items-center">
        <SocialIndicator value={account.followers_difference} />
      </div>
      <div className="grid grid-cols-7 gap-2 w-full">
        <div className="w-full col-span-2">
          <LineChartCompact
            data={account.historical}
            followers_difference={account?.followers_difference}
          />
        </div>
        <SocialStatsCard
          title="Followers"
          value={account.latest_followers}
          disableIndicator
          className="border-none"
        />
        <SocialStatsCard
          title="Difference"
          value={account.followers_difference}
          className="border-none"
          disableIndicator
        />
        <SocialStatsCard
          title="Avarage per 1 hour"
          value={account.average_per_1_hour}
          className="border-none"
          disableIndicator
        />
        <SocialStatsCard
          title="Avarage per 1 day"
          value={account.average_per_1_day}
          className="border-none"
          disableIndicator
        />
        <SocialStatsCard
          title="Avarage per 1 month"
          value={account.average_per_1_month}
          className="border-none"
          disableIndicator
        />
      </div>
    </div>
  )
}

export function ConfirmRemoveAccountDialog({
  accountToRemove,
  setAccountToRemove,
  removeAccount
}: {
  accountToRemove: string
  setAccountToRemove: (v: string) => void
  removeAccount: (v: ApiInstaInsightsAccount) => void
}) {
  return (
    <AlertDialog open={!!accountToRemove} onOpenChange={() => setAccountToRemove('')}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove {accountToRemove} ? </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete {accountToRemove} from the
            insta insights config.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => removeAccount({ account: accountToRemove, active: false })}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
