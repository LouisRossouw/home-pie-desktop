import {
  Bot,
  CircleDollarSign,
  Server,
  Cog,
  Cone,
  Eye,
  Box,
  Home,
  Shield,
  Settings
} from 'lucide-react'

export const menus = [
  {
    title: 'Home',
    icon: Home,
    route: '/',
    subMenus: []
  },
  {
    title: 'Projects',
    icon: Box,
    route: 'projects',
    subMenus: [
      { title: 'overview', slug: 'projects', icon: Cone, url: '/projects' },
      {
        title: 'projects-settings',
        slug: 'project-settings',
        icon: Shield,
        url: '/projects/project-settings'
      }
    ]
  },
  {
    title: 'My Finances',
    icon: CircleDollarSign,
    route: 'my-finances',
    subMenus: [
      { title: 'overview', icon: Eye, slug: 'my-finances', url: '/my-finances' },
      {
        title: 'my-finances-settings',
        slug: 'my-finances-settings',
        icon: Cog,
        url: '/my-finances/my-finances-settings'
      }
    ]
  },
  {
    title: 'Servers',
    icon: Server,
    route: 'servers',
    subMenus: [{ title: 'overview', icon: Eye, slug: 'servers', url: '/servers' }]
  },
  {
    title: 'GenGen',
    icon: Bot,
    route: 'gengen',
    subMenus: [
      { title: 'overview', icon: Eye, slug: 'gengen', url: '/gengen' },
      {
        title: 'gengen-settings',
        slug: 'gengen-settings',
        icon: Cog,
        url: '/gengen/gengen-settings'
      }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    route: 'settings',
    subMenus: []
  }
]
