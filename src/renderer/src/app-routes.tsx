import { Route, Routes } from 'react-router'

import { NoMatch } from './routes/no-match'
import NoConnectionRoute from './routes/no-connection'

import { AppLayout } from './routes/app-layout'

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
import InstaInsightsConfigRoute from './routes/sub-projects/insta-insights/config'
import ServersRoute from './routes/servers'
import ServersOverviewRoute from './routes/servers/overview'
import TimeInProgressConfigRoute from './routes/sub-projects/time-in-progress/config'
import { TimeInProgressOverview } from './components/projects/time-in-progress/overview'
import EnergyRoute from './routes/smart-home/energy'
import EnergyReserveDetailRoute from './routes/smart-home/energy/reserve'
import EnergyConsumptionDetailRoute from './routes/smart-home/energy/consumption'
import EnergyTimeRemainingDetailRoute from './routes/smart-home/energy/time-remaining'
import TemperatureRoute from './routes/smart-home/temperature'
import YouTubeConfigRoute from './routes/sub-projects/yt-insights/config'
import YouTubeInsightsRoute from './routes/sub-projects/yt-insights'
import YTInsightsRoute from './routes/sub-projects/yt-insights/insights'
import YTInsightsOverviewRoute from './routes/sub-projects/yt-insights/overview'
import CompleteAuthorizationRoute from './routes/authorize'
import LoginRoute from './routes/login'
import TailNetRoute from './routes/tailnet'
import TailNetOverviewRoute from './routes/tailnet/overview'

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
  { path: 'login', element: <LoginRoute /> },
  { path: 'no-connection', element: <NoConnectionRoute /> },
  { path: 'complete-auth-app', element: <CompleteAuthorizationRoute /> }
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
      },
      {
        path: 'yt-insights',
        element: <YouTubeInsightsRoute />,
        children: [
          { index: true, element: <YTInsightsOverviewRoute /> },
          {
            path: ':account',
            children: [{ path: 'insights', element: <YTInsightsRoute /> }]
          },
          {
            path: 'config',
            element: <YouTubeConfigRoute />
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

const tailNetRoutes = [
  {
    path: 'tailnet',
    element: <TailNetRoute />,
    children: [{ index: true, element: <TailNetOverviewRoute /> }]
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
      {
        path: 'energy',
        children: [
          { index: true, element: <EnergyRoute /> },
          { path: 'reserve', element: <EnergyReserveDetailRoute /> },
          { path: 'consumption', element: <EnergyConsumptionDetailRoute /> },
          { path: 'time-remaining', element: <EnergyTimeRemainingDetailRoute /> }
        ]
      },
      { path: 'temperature', element: <TemperatureRoute /> }
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
      ...tailNetRoutes,
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
