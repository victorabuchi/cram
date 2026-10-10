import { Card, Col, Row } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import { badgeStyle } from '../badge'
import { getSubject } from '../data/subjects'
import { TOPICS, scopedItems, scopedLearn, scopedVariants, topicsIn } from '../data/content'

const COLORS = { learn: '#3178C6', practice: '#4EAA25', mock: '#EA4335', code: '#363636', exercises: '#E76F00', variants: '#4EAA25' }

const TOOLS = [
  { path: 'learn', title: 'Learn', text: 'Lecture summaries and notes.' },
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
  const base = subject.quiz === false ? TOOLS.filter((t) => t.path === 'learn') : TOOLS.filter((t) => t.path !== 'mock' || subject.mock !== false)
  const codeText = subject.quiz === false
    ? 'Type your answer, check it, and see the solution.'
    : 'Write the function and run the tests, like the Moodle JavaScript syntax exercise.'
  const tools = [
    ...base,
    ...(scoped.some((i) => i.kind === 'code') ? [{ path: 'code', title: 'Code exercises', text: codeText }] : []),
    ...(scoped.some((i) => i.exercise) ? [{ path: 'exercises', title: 'Exercises', text: 'The exercise tasks the test is built from. Solve on paper, then check the answer.' }] : []),
    ...(scopedVariants(subjectId, week).length ? [{ path: 'variants', title: 'Practice', text: 'The same tasks again with other values, with the answers. Practise until you can do them without help.' }] : []),
  ]
  return (
    <>
      <Crumbs subjectId={subjectId} week={week} />
      <h1 className="h3">Week {w.n}: {w.title}</h1>
      <p className="text-body-secondary">Topics: {topics.join(', ') || 'none yet'}</p>
      <Row xs={1} md={2} lg={tools.length > 3 ? 4 : 3} className="g-3">
        {tools.map((t) => (
          <Col key={t.path}>
            <Card as={Link} to={`/s/${subjectId}/${week}/${t.path}`} className="course-card badge-card h-100 text-decoration-none" style={badgeStyle(COLORS[t.path] ?? '#444444')}>
              <Card.Body>
                <Card.Title as="h2" className="fs-5">{t.title}</Card.Title>
                <Card.Text>{t.text}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  )
}

export default WeekHub
