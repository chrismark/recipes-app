import { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Carousel } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderMinimal } from '../Header';

const PostFullscreen = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post: localPost } = location.state;
  const [post, setPost] = useState(localPost);

  // TODO: Fetch post from react-query using client provider
  const onClose = (e) => {
    e.preventDefault();
    navigate('/'); // Back to Posts
  };

  return (
    <Modal show={true} fullscreen={true}>
      <Modal.Body>
        <HeaderMinimal user={user} id='postfullscreen-header' className='postfullscreen-header' onClose={onClose} />
        <Container className='g-0' fluid={true} style={{marginTop: '0'}}>
          <Row className='postfullscreen' style={{marginLeft: '-1rem', marginRight: '-1rem', marginTop: '-1rem', marginBottom: '-1rem' }}>
            <Col style={{background: 'black'}} className='postfullscreen-viewer'>
              Test
            </Col>
            <Col style={{background: 'lightblue'}} className='postfullscreen-comments'>
              Test
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PostFullscreen;