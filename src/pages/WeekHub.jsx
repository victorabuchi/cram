import { Card, Col, Row } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import { getSubject } from '../data/subjects'
import { TOPICS, scopedItems, topicsIn } from '../data/content'

const TOOLS = [
  { path: 'learn', title: 'Learn', text: 'Lecture summaries with code examples.' },
  { path: 'practice', title: 'Practice', text: 'Questions with instant feedback. Wrong answers come back sooner.' },
  { path: 'mock', title: 'Practice test', text: 'Mixed questions, no feedback until the end.' },
]

function WeekHub() {
  const { subjectId, week } = useParams()
  const subject = getSubject(subjectId)
  const w = subject?.weeks.find((x) => x.n === Number(week))
  if (!subject || !w) return <Navigate to={subject ? `/s/${subjectId}` : '/'} replace />

  const topics = topicsIn(scopedItems(subjectId, week)).map((k) => TOPICS[k])
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} />
      <h1 className="h3">Week {w.n}: {w.title}</h1>
      <p className="text-body-secondary">Topics: {topics.join(', ') || 'none yet'}</p>
      <Row xs={1} md={3} className="g-3">
        {TOOLS.map((t) => (
          <Col key={t.path}>
            <Card as={Link} to={`/s/${subjectId}/${week}/${t.path}`} className="course-card h-100 text-decoration-none">
              <Card.Body>
                <Card.Title as="h2" className="fs-5">{t.title}</Card.Title>
                <Card.Text className="text-body-secondary">{t.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default WeekHub
