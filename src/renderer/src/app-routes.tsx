import { Route, Routes } from 'react-router'

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
import AuthorizationRoute from './routes/authorize'

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
      { path: 'time-in-progress', element: <TimeInProgressRoute /> },
      {
        path: 'insta-insights',
        element: <InstaInsightsRoute />,
        children: [
          { index: true, element: <InstaInsightsOverviewRoute /> },
          {
            path: ':account',
            children: [{ path: 'insights', element: <InsightsRoute /> }]
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
      ...gengenRoutes,
      ...pingPingRoutes,
      { path: 'debug', element: <DebugRoute /> },
      { path: 'settings', element: <SettingsRoute /> }
    ]
  }
]

const routesConfig = [...authRoutes, ...appRoutes, { path: '*', element: <NoMatch /> }]
