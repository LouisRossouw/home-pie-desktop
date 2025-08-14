import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  Dialog,
  DialogTitle,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'

export function AddAccountDialog() {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  // const [error, setError] = useState(false) // TODO; Handle errors

  const [active, setActive] = useState(false)

  const { mutateAsync: addAccounts, isPending } = useMutation({
    mutationKey: ['add-account'],
    mutationFn: AddAccount,
    onSuccess: async ({ ok }) => {
      if (ok) {
        await queryClient.invalidateQueries({ queryKey: ['insta-insights-all-accounts'] })
        setOpen(false)
      }
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const account = (formData.get('name') ?? '').toString()

    addAccounts({ account, active })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add account</DialogTitle>
            <DialogDescription>Add an account to be tracked by insta insights.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Account Name</Label>
                <Input required id="name-1" name="name" placeholder="kpow_636" />
              </div>

              <div className="grid gap-3">
                <div className="flex items-center space-x-2">
                  <Switch id="active" checked={active} onCheckedChange={setActive} />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button disabled={isPending} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

async function AddAccount({ account, active }: { account: string; active: boolean }) {
  return await window.api.external.apiInstaInsightsAddAccount({ account, active })
}
