import { Breadcrumb } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getSubject } from '../data/subjects'

// Dashboard > Subject > Week > (current page)
function Crumbs({ subjectId, week, current }) {
  const subject = getSubject(subjectId)
  return (
    <Breadcrumb>
      <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Dashboard</Breadcrumb.Item>
      {subject && (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/s/${subjectId}` }}>{subject.title}</Breadcrumb.Item>
      )}
      {week && (
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/s/${subjectId}/${week}` }}>
          {week === 'all' ? 'All weeks' : `Week ${week}`}
        </Breadcrumb.Item>
      )}
      {current && <Breadcrumb.Item active>{current}</Breadcrumb.Item>}
    </Breadcrumb>
  )
}

export default Crumbs
