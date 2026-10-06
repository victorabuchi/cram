import { Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'

function NavBar() {
  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="sm" sticky="top">
      <Container>
        <Navbar.Brand as={NavLink} to="/">Scribletics</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav>
            <Nav.Link as={NavLink} to="/" end>Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/progress">Progress</Nav.Link>
            <Nav.Link as={NavLink} to="/glossary">Glossary</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar
