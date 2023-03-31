import { useState, useEffect, useContext, forwardRef } from 'react';
import { Modal, Container, Row, Col, Carousel, Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { AppStateContext } from '../../appContext.js';
import { useStore } from '../Toaster';
import { HeaderMinimal } from '../Header';
import PostHeader from './PostHeader';
import { PostContentFullscreen } from './PostContent.js';
import PostFooter from './PostFooter';
import { doUpdateLike, doUpdateUnlike } from '../postLib';

const PostFullscreen = forwardRef(({ user }, ref) => {
  const { toast } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { pageOffset } = useContext(AppStateContext);
  const { post: localPost, index } = location.state;
  const [post, setPost] = useState(localPost);
  const [activeIndex, setActiveIndex] = useState(index);
  const isSingleRecipe = post.recipes.length == 1;
  // if there is only one associated recipe, then take from post.message, else take from recipe.caption
  const [message, setMessage] = useState(!isSingleRecipe ? post.recipes[index].caption : post.message);
  const queryClient = useQueryClient();

  console.log('PostFullscreen message=', message);
  console.log('PostFullscreen', 'isSingleRecipe=', isSingleRecipe, 'post=', post, 'activeIndex=', isSingleRecipe ? -1 : activeIndex, 'recipe=', post.recipes[isSingleRecipe ? -1 : activeIndex], 'stats=', post.stats[(isSingleRecipe ? -1 : activeIndex)+1]);
  // console.log('pageOffset', pageOffset);
  // console.log('activeIndex', activeIndex);

  useEffect(() => {
    return () => console.log('PostFullscreen UNMOUNTING');
  }, []);

  // TODO: Fetch post from react-query using client provider ONLY if post isn't available
  const onClose = (e) => {
    e.preventDefault();
    navigate(-1); // Back to Posts
  };

  const onSelect = (selectedIndex, e) => {
    setActiveIndex(selectedIndex);
    setMessage(post.recipes[selectedIndex].caption);
  };

  const onLikeError = (e) => {
    toast('Something happened while liking the post. Please try again later.');
  };

  const onUnlikeError = (e) => {
    toast('Something happened while unliking the post. Please try again later.');
  };

  const handleUpdateLike = async (payload) => {
    await doUpdateLike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], setPost, onLikeError);
  };

  const handleUpdateUnlike = async (payload) => {
    await doUpdateUnlike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], setPost, onUnlikeError);
  };

  return (
    <Modal show={true} fullscreen={true} animation={false} container={ref}>
      <Modal.Body>
        <HeaderMinimal user={user} id='postfullscreen-header' className='postfullscreen-header' onClose={onClose} />
        <Container className='g-0' fluid={true} style={{marginTop: '0'}}>
          <Row className='postfullscreen' style={{marginLeft: '-1rem', marginRight: '-1rem', marginTop: '-1rem', marginBottom: '-1rem' }}>
            <Col style={{background: 'black'}} className='postfullscreen-viewer'>
              <Carousel interval={null} fade={true} slide={false} indicators={false} wrap={!isSingleRecipe} activeIndex={activeIndex} onSelect={onSelect}>
                {post.recipes.map(recipe => (
                  <Carousel.Item key={recipe.id}>
                    <img src={recipe.thumbnail_url} />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Col>
            <Col className='postfullscreen-comments'>
              <div className='postfullscreen-header-spacer'></div>
              <PostHeader user={user} post={post} hideActionButtons={true} />
              <PostContentFullscreen post={post} message={message} />
              <PostFooter user={user} post={post} recipeIndex={isSingleRecipe ? -1 : activeIndex} statIndex={isSingleRecipe ? 0 : activeIndex+1} onLike={handleUpdateLike} onUnlike={handleUpdateUnlike} />
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
});

export default PostFullscreen;