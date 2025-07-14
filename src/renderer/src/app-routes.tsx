import { Routes, Route } from 'react-router'

import { MainLayout } from './routes/main-layout'

import Login from './routes/login'
import Home from './routes/home'

import { NoMatch } from './routes/no-match'
import Settings from './routes/settings'
import Projects from './routes/projects'
import ProjectsOverviewRoute from './routes/projects/overview'
import ProjectSettings from './routes/projects/settings'
import TimeInProgressRoute from './routes/projects/time-in-progress'
import InstaInsightsRoute from './routes/projects/insta-insights'
import NoConnectionRoute from './routes/no-connection'
import DebugRoute from './routes/debug'
import MyFinancesOverviewRoute from './routes/my-finances/overview'
import MyFinances from './routes/my-finances'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="no-connection" element={<NoConnectionRoute />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />}>
          <Route index element={<ProjectsOverviewRoute />} />
          <Route path="project-settings" element={<ProjectSettings />} />
          <Route path="time-in-progress" element={<TimeInProgressRoute />} />
          <Route path="insta-insights" element={<InstaInsightsRoute />} />
        </Route>
        <Route path="my-finances" element={<MyFinances />}>
          <Route index element={<MyFinancesOverviewRoute />} />
          <Route path="my-finances-settings" element={<ProjectSettings />} />
          {/* <Route path="time-in-progress" element={<TimeInProgressRoute />} /> */}
        </Route>
        <Route path="debug" element={<DebugRoute />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
