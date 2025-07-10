// import { requireSession } from '@main/session'

// Not too sure about fetching projects

const projects = [
  {
    title: 'TimeInProgress',
    slug: 'time-in-progress',
    img: undefined
  },
  {
    title: 'InstaInsights',
    slug: 'insta-insights',
    img: undefined
  }
]

export async function apiProjectList() {
  // const apiClient = await requireSession()

  console.log('API call; apiProjectList')

  // const response = await apiClient.get('todo', {
  //   headers: { 'Content-Type': 'application/json' }
  // })

  // if (response.status === 200) {
  //   return { ok: true, data: response.data }
  // }

  // console.error('Something went wrong')

  // return { ok: false }

  return { ok: true, data: projects }
}
