import { Outlet, Route, Routes } from 'react-router'

import { NoMatch } from './routes/no-match'
import NoConnectionRoute from './routes/no-connection'

import { AppLayout } from './routes/app-layout'

import Login from './routes/login'
import DebugRoute from './routes/debug'

import Home from './routes/home'
import SettingsRoute from './routes/settings'

import MyFinancesOverviewRoute from './routes/my-finances/overview'

import ProjectsRoute from './routes/projects'
import ProjectsOverviewRoute from './routes/sub-projects/overview'
import ProjectSettingsRoute from './routes/sub-projects/settings'
import InstaInsightsRoute from './routes/sub-projects/insta-insights'
import InstaInsightsOverviewRoute from './routes/sub-projects/insta-insights/overview'

import GenGenRoute from './routes/gengen'
import MyFinancesRoute from './routes/my-finances'
import GenGenSettingsRoute from './routes/gengen/settings'
import GenGenOverviewRoute from './routes/gengen/overview'
import GenGenTimeInProgressRoute from './routes/gengen/time-in-progress'
import TimeInProgressRoute from './routes/sub-projects/time-in-progress'
import InsightsRoute from './routes/sub-projects/insta-insights/insights'

import PingPingOverviewRoute from './routes/ping-ping/overview'
import PingPingRoute from './routes/ping-ping'
import SmartHomeRoute from './routes/smart-home'
import SmartHomeOverviewRoute from './routes/smart-home/overview'
import AuthorizationRoute from './routes/authorize'
import InstaInsightsConfigRoute from './routes/sub-projects/insta-insights/config'
import ServersRoute from './routes/servers'
import ServersOverviewRoute from './routes/servers/overview'
import TimeInProgressConfigRoute from './routes/sub-projects/time-in-progress/config'
import { TimeInProgressOverview } from './components/projects/time-in-progress/overview'
import EnergyRoute from './routes/smart-home/energy'

export function AppRoutes() {
  return <Routes>{renderRoutes(routesConfig)}</Routes>
}

function renderRoutes(routes) {
  return routes.map(({ children, ...route }, index: number) => (
    <Route key={index} {...route}>
      {children && renderRoutes(children)}
    </Route>
  ))
}

const authRoutes = [
  { path: 'login', element: <Login /> },
  { path: 'authorize', element: <AuthorizationRoute /> },
  { path: 'no-connection', element: <NoConnectionRoute /> }
]

const projectRoutes = [
  {
    path: 'projects',
    element: <ProjectsRoute />,
    children: [
      { index: true, element: <ProjectsOverviewRoute /> },
      { path: 'project-settings', element: <ProjectSettingsRoute /> },

      {
        path: 'time-in-progress',
        element: <TimeInProgressRoute />,
        children: [
          { index: true, element: <TimeInProgressOverview /> },
          {
            path: 'config',
            element: <TimeInProgressConfigRoute />
          }
        ]
      },
      {
        path: 'insta-insights',
        element: <InstaInsightsRoute />,
        children: [
          { index: true, element: <InstaInsightsOverviewRoute /> },
          {
            path: ':account',
            children: [{ path: 'insights', element: <InsightsRoute /> }]
          },
          {
            path: 'config',
            element: <InstaInsightsConfigRoute />
          }
        ]
      }
    ]
  }
]

const financeRoutes = [
  {
    path: 'my-finances',
    element: <MyFinancesRoute />,
    children: [
      { index: true, element: <MyFinancesOverviewRoute /> },
      { path: 'my-finances-settings', element: <div>TODO</div> }
    ]
  }
]

const serversRoutes = [
  {
    path: 'servers',
    element: <ServersRoute />,
    children: [{ index: true, element: <ServersOverviewRoute /> }]
  }
]

const smartHomeRoutes = [
  {
    path: 'smart-home',
    element: <SmartHomeRoute />,
    children: [
      { index: true, element: <SmartHomeOverviewRoute /> },
      { path: 'energy', element: <EnergyRoute /> }
    ]
  }
]

const gengenRoutes = [
  {
    path: 'gengen',
    element: <GenGenRoute />,
    children: [
      { index: true, element: <GenGenOverviewRoute /> },
      { path: 'time-in-progress', element: <GenGenTimeInProgressRoute /> },
      { path: 'gengen-settings', element: <GenGenSettingsRoute /> }
    ]
  }
]

const pingPingRoutes = [
  {
    path: 'ping-ping',
    element: <PingPingRoute />,
    children: [{ index: true, element: <PingPingOverviewRoute /> }]
  }
]

const appRoutes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      ...projectRoutes,
      ...financeRoutes,
      ...serversRoutes,
      ...gengenRoutes,
      ...pingPingRoutes,
      ...smartHomeRoutes,
      { path: 'debug', element: <DebugRoute /> },
      { path: 'settings', element: <SettingsRoute /> }
    ]
  }
]

const routesConfig = [...authRoutes, ...appRoutes, { path: '*', element: <NoMatch /> }]
