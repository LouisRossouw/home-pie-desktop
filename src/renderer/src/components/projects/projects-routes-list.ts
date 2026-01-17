import timeInProgressLogo from '/src/assets/projects/logo/timeinprogress-logo-play.gif'
import instagramLogo from '/src/assets/projects/logo/insta-logo.png'
import youTubeLogo from '/src/assets/projects/logo/yt_icon_red_digital.png'

// TODO; Fetch projects from the API, either on page load or during app load.
export const projectsAppRoutes = [
  {
    slug: 'time-in-progress',
    img: timeInProgressLogo,
    url: '/projects/time-in-progress'
  },
  {
    slug: 'insta-insights',
    img: instagramLogo,
    url: '/projects/insta-insights'
  },
  {
    slug: 'yt-insights',
    img: youTubeLogo,
    url: '/projects/yt-insights'
  }
]
