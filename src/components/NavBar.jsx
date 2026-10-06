import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink, useMatch } from 'react-router-dom'
import { getSubject } from '../data/subjects'

// Outside a course the bar is just the Dashboard. Inside a course it shows that course's own pages: its
// tools (Glossary for Web Programming I, Automata lab for Basic Models of Computation) and its Progress.
function NavBar() {
  const match = useMatch('/s/:subjectId/*')
  const subject = match ? getSubject(match.params.subjectId) : null
  return (
    <Navbar aria-label="Main" bg="dark" data-bs-theme="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Scribletics</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav>
            <Nav.Link as={NavLink} to="/" end>Dashboard</Nav.Link>
            {subject && (
              <Nav.Link as={NavLink} to={`/s/${subject.id}`} end>{subject.title}</Nav.Link>
            )}
            {subject?.tools.map((t) => (
              <Nav.Link key={t.path} as={NavLink} to={`/s/${subject.id}/${t.path}`}>{t.label}</Nav.Link>
            ))}
            {subject && <Nav.Link as={NavLink} to={`/s/${subject.id}/progress`}>Progress</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
