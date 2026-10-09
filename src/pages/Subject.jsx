import { Button, Col, Row } from 'react-bootstrap'
import { Link, Navigate, useParams } from 'react-router-dom'
import Crumbs from '../components/Crumbs.jsx'
import CourseCard from '../components/CourseCard.jsx'
import { getSubject } from '../data/subjects'
import { scopedItems, scopedLearn } from '../data/content'

function Subject() {
  const { subjectId } = useParams()
  const subject = getSubject(subjectId)
  if (!subject) return <Navigate to="/" replace />

  const all = scopedItems(subjectId, 'all')
  const hasCode = all.some((i) => i.kind === 'code')
  const hasExercises = all.some((i) => i.exercise)

  return (
    <>
      <Crumbs subjectId={subjectId} />
      <h1 className="h3">{subject.title}</h1>
      <p className="text-body-secondary">{subject.org}</p>
      {subject.weeks.length === 0 && <p className="text-body-secondary">No weeks yet. Course materials are added week by week.</p>}
      {subject.weeks.length > 0 && <div className="d-flex gap-2 flex-wrap mb-4">
        <Button as={Link} to={`/s/${subjectId}/all/learn`} variant="outline-primary">Learn all weeks</Button>
        {subject.quiz !== false && <Button as={Link} to={`/s/${subjectId}/all/practice`} variant="outline-primary">Practice all weeks</Button>}
        {subject.quiz !== false && subject.mock !== false && <Button as={Link} to={`/s/${subjectId}/all/mock`} variant="outline-primary">Practice test (all weeks)</Button>}
        {subject.quiz === false && hasCode && <Button as={Link} to={`/s/${subjectId}/all/code`} variant="outline-primary">Code exercises (all weeks)</Button>}
        {subject.quiz === false && hasExercises && <Button as={Link} to={`/s/${subjectId}/all/exercises`} variant="outline-primary">Exercises (all weeks)</Button>}
      </div>}
      {subject.weeks.length > 0 && <h2 className="h5 mb-3">Weeks</h2>}
      <Row xs={1} sm={2} md={3} className="g-3">
        {subject.weeks.map((w) => {
          const items = scopedItems(subjectId, w.n)
          const cards = scopedLearn(subjectId, w.n)
          return (
            <Col key={w.n}>
              <CourseCard
                cover={`Week ${w.n}`}
                title={w.title}
                subtitle={`${cards.length} learn cards · ${items.length} questions`}
                logos={w.logos}
                items={items}
                to={`/s/${subjectId}/${w.n}`}
                color={w.color}
              />
            </Col>
          )
        })}
      </Row>
    </>
  )
}

export default Subject
