import './assets/main.css'
import './assets/themes'

import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router'
import App from './App'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <HashRouter>
    <App />
  </HashRouter>
)
