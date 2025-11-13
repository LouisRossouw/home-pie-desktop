import { useOutletContext } from 'react-router'
import { SocialGraph } from './social-graph'

export function TimeInProgressOverview() {
  const { data } = useOutletContext<any>()

  return (
    <div className="grid h-full w-full gap-4 overflow-y-scroll grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
      <SocialGraph title={'Instagram'} data={data?.instagram} />
      <SocialGraph title={'YouTube'} data={data?.youtube} />
      <SocialGraph title={'TikTok'} data={data?.tiktok} editable ignoreActive />
      <SocialGraph title={'Bluesky'} data={data?.bluesky} />
      {/* <SocialGraph title={'Twitter'} data={data?.twitter} /> */}
    </div>
  )
}
