import { useNavigate, useOutletContext } from 'react-router'
import { cn } from '~/libs/utils/cn'

import { Label } from '~/components/ui/label'
import LineChartCompact from '~/components/line-chart-compact'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

import { SocialIndicator, SocialStatsCard } from '../time-in-progress/social-stats-card'
import { AccountsDataWithPic } from '.'

type InstaInsightsContext = {
  data: AccountsDataWithPic[]
  isPending: boolean
}

export function InstaInsightsOverview() {
  const { data } = useOutletContext<InstaInsightsContext>()

  const navigate = useNavigate()

  return (
    <div className="flex w-full h-[calc(100vh-96px)] items-center justify-center pb-20">
      <div className="w-full p-4 overflow-y-scroll h-full">
        {data?.map((account, index) => {
          return (
            <div key={index}>
              <AccountRow
                account={account}
                navigate={(v: string) => navigate(`/projects/insta-insights/${v}/insights`)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AccountRow({
  account,
  navigate
}: {
  account: AccountsDataWithPic
  navigate: (v: string) => void
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-center  border-b hover:border-accent/50',
        account.account === 'time.in.progress' && 'bg-accent/10'
      )}
      onClick={() => navigate(account.account)}
    >
      <SocialIndicator value={account.followers_difference} />
      <div className={`flex rounded-lg w-64 p-4 m-0`}>
        <Avatar>
          <AvatarImage src={account.profile_picture_url} alt="NA" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="text-white w-full flex items-center justify-start ml-4">
          <Label>{account.account}</Label>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-2 w-full">
        <div className="w-full h-full">
          <LineChartCompact
            data={account.history}
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
        />
        <SocialStatsCard
          title="Avarage per 1 hour"
          value={account.average_per_1_hour}
          className="border-none"
        />
        <SocialStatsCard
          title="Avarage per 1 day"
          value={account.average_per_1_day}
          className="border-none"
        />
        <SocialStatsCard
          title="Avarage per 1 month"
          value={account.average_per_1_month}
          className="border-none"
        />
      </div>
    </div>
  )
}
