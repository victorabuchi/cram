import { Col, Row } from 'react-bootstrap'
import CourseCard from '../components/CourseCard.jsx'
import { SUBJECTS } from '../data/subjects'
import { scopedItems } from '../data/content'

function Dashboard() {
  return (
    <>
      <h1 className="h3 mb-3">Dashboard</h1>
      <h2 className="h5 mb-3">My subjects</h2>
      <Row xs={1} sm={2} md={3} className="g-3">
        {SUBJECTS.map((s) => (
          <Col key={s.id}>
            <CourseCard
              title={s.title}
              subtitle={`${s.org} · ${s.weeks.length} ${s.weeks.length === 1 ? 'week' : 'weeks'}`}
              logos={s.logos}
              items={scopedItems(s.id, 'all')}
              to={`/s/${s.id}`}
              color={s.color}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Dashboard
