import { useEffect, useRef } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import NavBar from './components/NavBar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Subject from './pages/Subject.jsx'
import WeekHub from './pages/WeekHub.jsx'
import Learn from './pages/Learn.jsx'
import Practice from './pages/Practice.jsx'
import Mock from './pages/Mock.jsx'
import Progress from './pages/Progress.jsx'
import Glossary from './pages/Glossary.jsx'
import AutomataLab from './pages/AutomataLab.jsx'

function App() {
  const mainRef = useRef(null)
  const { pathname } = useLocation()
  const firstRender = useRef(true)

  // After a route change, move focus to the page content so keyboard and screen-reader users
  // do not stay on the link they clicked. Skipped on the initial load.
  useEffect(() => {
    if (firstRender.current) firstRender.current = false
    else mainRef.current?.focus({ preventScroll: true })
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#main" className="visually-hidden-focusable skip-link" onClick={(e) => { e.preventDefault(); mainRef.current?.focus() }}>Skip to content</a>
      <NavBar />
      <main id="main" ref={mainRef} tabIndex={-1} className="container py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/s/:subjectId" element={<Subject />} />
          <Route path="/s/webprog/glossary" element={<Glossary />} />
          <Route path="/s/bmc/automata" element={<AutomataLab />} />
          <Route path="/s/:subjectId/:week" element={<WeekHub />} />
          <Route path="/s/:subjectId/:week/learn" element={<Learn />} />
          <Route path="/s/:subjectId/:week/practice" element={<Practice />} />
          <Route path="/s/:subjectId/:week/mock" element={<Mock />} />
          <Route path="/s/:subjectId/progress" element={<Progress />} />
          <Route path="/progress" element={<Navigate to="/" replace />} />
          <Route path="/glossary" element={<Navigate to="/s/webprog/glossary" replace />} />
          <Route path="/automata" element={<Navigate to="/s/bmc/automata" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  )
}

export default App
