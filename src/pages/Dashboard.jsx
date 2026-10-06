import { Col, Row } from 'react-bootstrap'
import CourseCard from '../components/CourseCard.jsx'
import { SUBJECTS } from '../data/subjects'
import { ITEMS } from '../data/content'

function Dashboard() {
  return (
    <>
      <h1 className="h3 mb-3">Dashboard</h1>
      <h2 className="h5 mb-3">My subjects</h2>
      <Row xs={1} sm={2} md={3} className="g-3">
        {SUBJECTS.map((s) => (
          <Col key={s.id}>
            <CourseCard
              cover={s.title.split(' ').map((w) => w[0]).join('')}
              title={s.title}
              subtitle={`${s.org} · ${s.weeks.length} weeks`}
              color={s.color}
              items={ITEMS.filter((i) => s.weeks.some((w) => w.n === i.week))}
              to={`/s/${s.id}`}
            />
          </Col>
        ))}
      </Row>
    </>
  )
}

export default Dashboard
