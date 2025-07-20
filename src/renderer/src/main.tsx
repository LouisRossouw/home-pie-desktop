import './assets/main.css'
import './assets/themes'

import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App'
// import React from 'react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <React.StrictMode>
  <HashRouter>
    <App />
  </HashRouter>
  // </React.StrictMode>
)
