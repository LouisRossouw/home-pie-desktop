import { Button } from './ui/button'
import { useEffect, useState } from 'react'
import { ChevronDown, Cog, LogOut, MessageCircleQuestion, Plus, User, Users } from 'lucide-react'
import { getWebDashboardUrl, getWebSupportUrl } from '@shared/constants'

import { useAccounts } from '~/libs/hooks/use-accounts'
import { useApp } from '~/libs/context/app'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'

// TODO; Do better =)

export function AccountSelector() {
  const { appSettings } = useApp()
  const ACC = useAccounts()

  const [confirmation, setConfirmation] = useState(false)

  useEffect(() => {
    const init = async () => {
      await ACC.loadAvailableAccounts()
    }

    init()
  }, [ACC.account])

  const userId = appSettings?.activeAccountId as number

  return (
    <>
      <LogOutDialog
        open={confirmation}
        setOpen={setConfirmation}
        accountName={ACC.account?.email}
        logout={() => ACC.logoutAccount({ userId })}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="p-4">
            <AccountAvatar imgPath="https://github.com/louisrossouw.png" />
            {ACC.account?.email} <ChevronDown size={18} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => window.api.app.openBrowserToUrl({ url: getWebDashboardUrl })}
            >
              <Cog />
              Account settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => window.api.app.openBrowserToUrl({ url: getWebSupportUrl })}
          >
            <MessageCircleQuestion />
            Support
          </DropdownMenuItem>
          {/* {ACC.availableAccounts && ACC.availableAccounts?.length < 3 && (
            <DropdownMenuItem onClick={() => ACC.addAnotherAccount()}>
              <Plus />
              Add another account
            </DropdownMenuItem>
          )} */}
          <DropdownMenuItem onClick={() => ACC.addAnotherAccount()}>
            <Plus />
            Add another account
          </DropdownMenuItem>
          {ACC.availableAccounts && ACC.availableAccounts?.length > 1 && <DropdownMenuSeparator />}

          {ACC.availableAccounts?.map((acc) => {
            if (acc.active && acc.userId !== appSettings?.activeAccountId) {
              return (
                <DropdownMenuItem onClick={() => ACC.switchUserAccount({ userId: acc.userId })}>
                  <User />
                  {acc.email}
                </DropdownMenuItem>
              )
            } else return null
          })}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setConfirmation(true)}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export function AccountAvatar({ imgPath }: { imgPath?: string }) {
  return (
    <Avatar className="rounded-lg w-6 h-6">
      <AvatarImage src={imgPath} alt="" />
      <AvatarFallback>TODO</AvatarFallback>
    </Avatar>
  )
}

export function LogOutDialog({
  open,
  setOpen,
  accountName,
  logout
}: {
  open: boolean
  setOpen: (v: boolean) => void
  accountName?: string
  logout: () => void
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(false)
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Logout</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">Log out of {accountName}?</div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button
            onClick={() => {
              logout()
              setOpen(false)
            }}
          >
            Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
