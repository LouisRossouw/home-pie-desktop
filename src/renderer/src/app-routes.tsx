import { Routes, Route } from 'react-router'

import { MainLayout } from './routes/main-layout'

import Login from './routes/login'
import Home from './routes/home'

import { NoMatch } from './routes/no-match'
import { Settings } from './routes/settings'
import { Projects } from './routes/projects'
import OverView from './routes/projects/overview'
import ProjectSettings from './routes/projects/settings'
import TimeInProgressRoute from './routes/projects/time-in-progress'
import InstaInsightsRoute from './routes/projects/insta-insights'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />}>
          <Route index element={<OverView />} />
          <Route path="project-settings" element={<ProjectSettings />} />
          <Route path="time-in-progress" element={<TimeInProgressRoute />} />
          <Route path="insta-insights" element={<InstaInsightsRoute />} />
        </Route>
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
