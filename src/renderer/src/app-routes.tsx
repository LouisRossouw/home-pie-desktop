import { Routes, Route } from 'react-router'

import { MainLayout } from './routes/main-layout'

import { Login } from './routes/login'
import { Home } from './routes/home'
import { About } from './routes/about'
import { Dashboard } from './routes/dashboard'

import { NoMatch } from './routes/no-match'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />

      <Route path="/" element={<MainLayout />}>
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  )
}
