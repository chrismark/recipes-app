import { useEffect } from 'react';
import { Container, ToastContainer, Toast } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './Toaster';

const MainContainer = ({ children, user, innerRef }) => {
  return (<>  
    <Container fluid='sd'>
      <Header user={user} />
      {children}
      <Toaster />
      <Footer />
    </Container>
    
  </>);
};

export default MainContainer;