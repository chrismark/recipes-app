import { Container } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';

const MainContainer = ({ children, user }) => {
  return (
    <Container fluid='sd'>
      <Header user={user} />
      {children}
      <Footer />
    </Container>
  );
};

export default MainContainer;