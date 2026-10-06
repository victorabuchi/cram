import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.jsx'
import { ProgressProvider } from './context/ProgressContext.jsx'
import { TermsProvider } from './context/TermsContext.jsx'

// HashRouter keeps routes working on GitHub Pages, which has no server-side rewrites.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ProgressProvider>
        <TermsProvider>
          <App />
        </TermsProvider>
      </ProgressProvider>
    </HashRouter>
  </StrictMode>,
)
