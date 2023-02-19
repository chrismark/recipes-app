import { Nav, Navbar, Container, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsXLg } from 'react-icons/bs';

const Header = ({ user }) => {
  return (
    <Navbar expand='lg' bg='primary' variant='dark' className='app-header'>
      <Container fluid>
        <Navbar.Brand as={Link} to='/'>Recipes</Navbar.Brand>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            {user ?
              (<>
              <Nav.Link as={Link} to='/'>All Posts</Nav.Link>
              <Nav.Link as={Link} to='/tasty-recipes'>Tasty.co Recipes</Nav.Link>
              <Nav.Link as={Link} to='/saved-recipes'>Saved Recipes</Nav.Link>
              </>) 
              :
              ''
            }
          </Nav>
          {user ?
            (
            <Nav>
              <Nav.Link as={Link} to='/create-post'>Create Post</Nav.Link>
              <NavDropdown
                id='account-dropdown'
                title={'Account (' + (user.username ? user.username : user.firstname) + ')'}
              >
                <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to='/your-posts'>Your Posts</NavDropdown.Item>
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

const HeaderMinimal = ({ user, style = {}, id='', className='', onClose }) => {
  return (
    <Navbar id={id} fixed='top' bg='primary' expanded={true} variant='dark' className={'app-header' + (className ? ' ' + className: '')} style={style}>
      <Container fluid>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            <span className='my-btn-close-wrapper cursor-pointer' onClick={onClose}>
              <BsXLg aria-label='Close' className='my-btn-close fs-5 font-weight-light'  />
            </span>
          </Nav>
          <Nav>
            <NavDropdown
              id='account-dropdown'
              title={'Account (' + (user.username ? user.username : user.firstname) + ')'}
              variant='primary'
            >
              <NavDropdown.Item as={Link} to='/profile'>Profile</NavDropdown.Item>
              <NavDropdown.Item as={Link} to='/your-posts'>Your Posts</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to='/logout'>Logout</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export { HeaderMinimal };