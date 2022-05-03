import { Container, Row, Col, Spinner } from 'react-bootstrap';

const Loading = ({ show }) => {
  return show && (
  <Container fluid='sd' className='centered-loading-animation-container'>
    <Row lg={1} className='centered-loading-animation-row justify-content-md-center'>
      <Col className='centered-loading-animation-col'><Spinner animation='grow' className='m-auto' /></Col>
    </Row>
  </Container>
  );
};

export default Loading;