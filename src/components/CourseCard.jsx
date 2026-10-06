import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Meter from './Meter.jsx'
import { useProgress } from '../hooks/useProgress'
import { isMastered } from '../storage'

// A dashboard-style card: coloured cover, title, subtitle, mastered progress.
function CourseCard({ cover, title, subtitle, color, items, to }) {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const mastered = items.filter((i) => isMastered(progress, i.id)).length
  const pct = items.length ? Math.round((mastered / items.length) * 100) : 0
  return (
    <Card
      className="course-card h-100 overflow-hidden"
      role="link"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
    >
      <div className="course-cover" style={{ background: color }}>{cover}</div>
      <Card.Body>
        <Card.Title as="h3" className="fs-6">{title}</Card.Title>
        <Card.Subtitle className="text-body-secondary small mb-3">{subtitle}</Card.Subtitle>
        <Meter now={pct} height={6} label={`${title}: ${pct}% mastered`} />
        <small className="text-body-secondary">{pct}% mastered</small>
      </Card.Body>
    </Card>
  )
}

export default CourseCard
