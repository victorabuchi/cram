import { Card, Col, Row } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import { getSubject } from '../data/subjects'
import { TOPICS, scopedItems, scopedLearn, topicsIn } from '../data/content'

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

  const scoped = scopedItems(subjectId, week)
  const topics = [...new Set([...topicsIn(scoped), ...scopedLearn(subjectId, week).map((c) => c.topic)])].map((k) => TOPICS[k])
  const base = subject.quiz === false ? TOOLS.filter((t) => t.path === 'learn') : TOOLS
  const codeText = subject.quiz === false
    ? 'Type your answer, check it, and see the solution.'
    : 'Write the function and run the tests, like the Moodle JavaScript syntax exercise.'
  const tools = scoped.some((i) => i.kind === 'code')
    ? [...base, { path: 'code', title: 'Code exercises', text: codeText }]
    : base
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} />
      <h1 className="h3">Week {w.n}: {w.title}</h1>
      <p className="text-body-secondary">Topics: {topics.join(', ') || 'none yet'}</p>
      <Row xs={1} md={2} lg={tools.length > 3 ? 4 : 3} className="g-3">
        {tools.map((t) => (
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
