import { useContext, forwardRef } from 'react';
import { Container, ToastContainer, Toast } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './Toaster';

const MainContainer = forwardRef(({ user, children }, ref) => {
  return (
    <>
    <Container fluid='sd'>
      <Header user={user} />
      {children}
      <Outlet />
      <Toaster />
      <Footer />
    </Container>
    <div ref={ref} className='post-fullscreen-container'></div>
    </>
  );
});

export default MainContainer;