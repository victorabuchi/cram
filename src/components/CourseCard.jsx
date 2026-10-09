import { Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Meter from './Meter.jsx'
import { badge, badgeStyle } from '../badge'
import { useProgress } from '../hooks/useProgress'
import { isMastered } from '../storage'

// A badge-style card (solid colour, like the shields.io badges on the GitHub profile): logos, title, mastered progress.
function CourseCard({ cover, title, subtitle, logos = [], items, to, color = '#444444' }) {
  const navigate = useNavigate()
  const { progress } = useProgress()
  const mastered = items.filter((i) => isMastered(progress, i.id)).length
  const pct = items.length ? Math.round((mastered / items.length) * 100) : 0
  return (
    <Card
      className="course-card badge-card h-100"
      style={badgeStyle(color)}
      role="link"
      tabIndex={0}
      onClick={() => navigate(to)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(to)}
    >
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between gap-2 mb-3">
          <div className="course-logos">
            {logos.map((l) => <img key={l.alt} src={l.src} alt={l.alt} height="30" style={{ filter: badge(color).filter }} />)}
          </div>
          {cover && <span className="course-cover-label">{cover}</span>}
        </div>
        <Card.Title as="h3" className="fs-6">{title}</Card.Title>
        <Card.Subtitle className="small mb-3">{subtitle}</Card.Subtitle>
        <Meter now={pct} height={6} label={`${title}: ${pct}% mastered`} />
        <small>{pct}% mastered</small>
      </Card.Body>
    </Card>
  )
}

export default CourseCard
