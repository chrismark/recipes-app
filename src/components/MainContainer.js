import { Container, ToastContainer, Toast } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import AutoHideToast from './AutoHideToast';

const MainContainer = ({ children, user, innerRef }) => {
  return (<>
    <ToastContainer ref={innerRef} className='position-fixed' position='top-center' style={{marginTop: '.5vh', zIndex: 9999999}}>
      <AutoHideToast delay={3000}>
        <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
      </AutoHideToast>
      <AutoHideToast delay={10000}>
        <Toast.Body>Comment deleted.</Toast.Body>
      </AutoHideToast>
    </ToastContainer>
    <Container fluid='sd'>
      <Header user={user} />
      {children}
      <Footer />
    </Container>
  </>);
};

export default MainContainer;