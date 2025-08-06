// import { useMemo } from 'react'
import { Outlet } from 'react-router'

// import { Lightbulb } from 'lucide-react'
// import { useQuery } from '@tanstack/react-query'

// import { Button } from '~/components/ui/button'
// import { useNav } from '~/libs/hooks/use-navigation'

// import tempLogo from '../assets/projects/logo/timeinprogress-logo-play.gif'

// const myFinancesAppRoutes = [
//   {
//     slug: 'something-something',
//     img: undefined,
//     url: '/my-fincances/something'
//   }
// ]

export default function MyFinances() {
  // const { navigateTo } = useNav()
  // const { data: projectsRaw, isPending } = useQuery({
  //   queryKey: ['projects-list'],
  //   queryFn: getProjects
  // })

  // const myFinances = useMemo(() => {
  //   return myFinancesAppRoutes?.map((proj) => {
  //     const foundMyFinances = projectsRaw?.find((p) => p.slug === proj.slug)

  //     return { ...proj, ...foundMyFinances, img: proj?.img ? proj.img : foundMyFinances?.img }
  //   })
  // }, [projectsRaw])

  return (
    <div className="flex h-[calc(100vh-96px)] items-center justify-center">
      <Outlet />
    </div>
  )
}
