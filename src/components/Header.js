import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (user && (location.pathname === '/login' || location.pathname === '/register')) {
    navigate('/');
  }

  return (
    <Navbar expand='lg'>
      <Container fluid>
        <Navbar.Brand as={Link} to='/'>Recipes</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <Nav.Link as={Link} to='/'>Posts</Nav.Link>
          </Nav>
          
          {user ?
            (
              <Nav>
                <NavDropdown
                  id='account-dropdown'
                  title='Account'
                  menuVariant='dark'
                >
                  <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to='/logout'>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
            )
            : 
            (
              <Nav>
                <Nav.Link as={Link} to='/login'>Login</Nav.Link>
                <Nav.Link as={Link} to='/register'>Register</Nav.Link>
              </Nav>
            )
          }
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;