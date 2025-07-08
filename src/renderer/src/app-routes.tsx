import { Routes, Route, Link } from 'react-router'

import { Layout } from './components/layout'

import { Home } from './routes/home'
import { About } from './routes/about'
import { Dashboard } from './routes/dashboard'
import { Login } from './routes/login'
import { SplashRoute } from './routes/splash'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="login" element={<Login />} />
        <Route path="splash" element={<SplashRoute />} />

        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
