import { useEffect } from 'react';
import { Container, ToastContainer, Toast } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './Toaster';

const MainContainer = ({ user }) => {
  return (
    <Container fluid='sd'>
      <Header user={user} />
      <Outlet />
      <Toaster />
      <Footer />
    </Container>
  );
};

export default MainContainer;