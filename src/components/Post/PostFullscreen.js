import { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderMinimal } from '../Header';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

const PostFullscreen = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post: localPost } = location.state;
  const [post, setPost] = useState(localPost);

  // TODO: Fetch post from react-query using client provider ONLY if post isn't available
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
              <Carousel interval={null} fade={true} slide={false} indicators={false} wrap={false}>
                {post.recipes.map(recipe => (
                  <Carousel.Item key={recipe.id}>
                    <img src={recipe.thumbnail_url} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col style={{background: 'rgb(36, 37, 38)', color: 'rgb(238, 230, 235)'}} className='postfullscreen-comments'>
              <div class='postfullscreen-header-spacer'></div>
              <PostHeader user={user} post={post} />
              <p>{post.message}</p>
              <PostFooter user={user} post={post} />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PostFullscreen;