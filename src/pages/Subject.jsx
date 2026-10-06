import { Button, Col, Row } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import CourseCard from '../components/CourseCard.jsx'
import { getSubject } from '../data/subjects'
import { ITEMS, LEARN } from '../data/content'

function Subject() {
  const { subjectId } = useParams()
  const subject = getSubject(subjectId)
  if (!subject) return <Navigate to="/" replace />

  return (
    <>
      <Crumbs subjectId={subjectId} />
      <h1 className="h3">{subject.title}</h1>
      <p className="text-body-secondary">{subject.org}</p>
      <div className="d-flex gap-2 flex-wrap mb-4">
        <Button as={Link} to={`/s/${subjectId}/all/learn`} variant="outline-primary">Learn all weeks</Button>
        <Button as={Link} to={`/s/${subjectId}/all/practice`} variant="outline-primary">Practice all weeks</Button>
        <Button as={Link} to={`/s/${subjectId}/all/mock`} variant="outline-primary">Practice test (all weeks)</Button>
      </div>
      <h2 className="h5 mb-3">Weeks</h2>
      <Row xs={1} sm={2} md={3} className="g-3">
        {subject.weeks.map((w) => {
          const items = ITEMS.filter((i) => i.week === w.n)
          const cards = LEARN.filter((c) => c.week === w.n)
          return (
            <Col key={w.n}>
              <CourseCard
                cover={`Week ${w.n}`}
                title={w.title}
                subtitle={`${cards.length} learn cards · ${items.length} questions`}
                color={subject.color}
                items={items}
                to={`/s/${subjectId}/${w.n}`}
              />
            </Col>
          )
        })}
      </Row>
    </>
  )
}

export default Subject
