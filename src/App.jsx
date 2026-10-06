import { Navigate, Route, Routes } from 'react-router-dom'
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

function App() {
  return (
    <>
      <NavBar />
      <main className="container py-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/s/:subjectId" element={<Subject />} />
          <Route path="/s/:subjectId/:week" element={<WeekHub />} />
          <Route path="/s/:subjectId/:week/learn" element={<Learn />} />
          <Route path="/s/:subjectId/:week/practice" element={<Practice />} />
          <Route path="/s/:subjectId/:week/mock" element={<Mock />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ToastContainer position="bottom-right" autoClose={2500} />
    </>
  )
}

export default App
