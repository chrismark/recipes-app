import { useState, useEffect } from 'react';
import { Modal, Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { HeaderMinimal } from '../Header';
import PostHeader from './PostHeader';
import PostFooter from './PostFooter';

const PostFullscreen = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post: localPost, index } = location.state;
  const [post, setPost] = useState(localPost);
  const [activeIndex, setActiveIndex] = useState(index);
  const [message, setMessage] = useState(post.recipes.length > 1 ? post.recipes[index].caption : post.message);

  console.log('PostFullscreen', post.recipes[activeIndex]);

  // TODO: Fetch post from react-query using client provider ONLY if post isn't available
  const onClose = (e) => {
    e.preventDefault();
    navigate(-1); // Back to Posts
  };

  const onSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
    setMessage(post.recipes[selectedIndex].caption);
  }

  return (
    <Modal show={true} fullscreen={true}>
      <Modal.Body>
        <HeaderMinimal user={user} id='postfullscreen-header' className='postfullscreen-header' onClose={onClose} />
        <Container className='g-0' fluid={true} style={{marginTop: '0'}}>
          <Row className='postfullscreen' style={{marginLeft: '-1rem', marginRight: '-1rem', marginTop: '-1rem', marginBottom: '-1rem' }}>
            <Col style={{background: 'black'}} className='postfullscreen-viewer'>
              <Carousel interval={null} fade={true} slide={false} indicators={false} wrap={false} activeIndex={activeIndex} onSelect={onSelect}>
                {post.recipes.map(recipe => (
                  <Carousel.Item key={recipe.id}>
                    <img src={recipe.thumbnail_url} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col className='postfullscreen-comments'>
              <div className='postfullscreen-header-spacer'></div>
              <PostHeader user={user} post={post} />
              <p>{message}</p>
              <PostFooter user={user} post={post} recipeIndex={activeIndex+1} />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default PostFullscreen;