import { useState } from 'react'
import { Pen } from 'lucide-react'
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
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Platforms } from '@shared/types'

export function AddHistoricalDataDialog({
  platform,
  followersCount
}: {
  platform?: Platforms
  followersCount: number
}) {
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  // const [error, setError] = useState(false) // TODO; Handle errors

  const { mutateAsync: addHistoricalDataMutation, isPending } = useMutation({
    mutationKey: ['add-historical-data', { platform }],
    mutationFn: addHistorictalData,
    onSuccess: async ({ ok }) => {
      if (ok) {
        await queryClient.invalidateQueries({ queryKey: ['time-in-progress-overview'] })
        setOpen(false)
      }
    }
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    // Instagram & Bluesky & X-Twitter
    const followers = formData.get('followers')?.toString()
    const following = formData.get('following')?.toString()
    const likes = formData.get('likes')?.toString()

    // TODO;

    // const following = formData.get('following')
    // const posts = formData.get('posts')

    // // TikTok
    // const likes = formData.get('likes')

    // // YouTube
    // const views = formData.get('views')
    // const videos = formData.get('videos')
    // const subscribers = formData.get('subscribers')

    if (!platform || !followers || !following || !likes) {
      return alert('No platform')
    }

    addHistoricalDataMutation({
      platform,
      followers: parseInt(followers),
      following: parseInt(following),
      likes: parseInt(likes)
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant={'ghost'}>
          <Pen size={18} />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add data</DialogTitle>
            <DialogDescription>
              Insert data into Time In Progress {platform} historic database.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="followers">Followers</Label>
                <Input
                  required
                  type="number"
                  id="followers"
                  name="followers"
                  defaultValue={followersCount}
                />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="following">following</Label>
                <Input required type="number" id="following" name="following" />
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="Likes">Likes</Label>
                <Input required type="number" id="likes" name="likes" />
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

async function addHistorictalData({
  platform,
  followers,
  following,
  likes
}: {
  platform: Platforms
  followers: number
  following: number
  likes: number
}) {
  return await window.api.external.apiTimeInProgressInsertHistoricalData({
    platform,
    followers,
    following,
    likes
  })
}
