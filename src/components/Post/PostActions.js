import { useState, useRef, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegCommentAlt, FaShare } from 'react-icons/fa';
import PostButton from './PostButton';
import { AppContext } from '../../app-context.js';
import PostActionLikePopup from './PostActionLikePopup';
import { LikeButtonPopupIcon, LikeButtonIconText } from './LikeButton';

const PostActions = ({post, onLike, onShowComments}) => {
  console.log('PostActions post', post);
  const target = useRef(null);
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);
  const [show, setShow] = useState(false);
  const [user] = useContext(AppContext);
  const DELAY = 1200;

  const handleHoverIn = () => {
    console.log('handleHoverIn show=', show);
    // In case user moves out after moving inside the button, we don't show popup
    if (show && hideTimeout.current != null) {
      console.log('Cancelled hideTimeout.');
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
      return;
    }
    showTimeout.current = setTimeout(() => {
      console.log('hoverIn');
      setShow(true);
    }, DELAY);
  };

  const handleHoverOut = () => {
    console.log('handleHoverOut show=', show);
    // In case user moves back in after moving out of button, we don't hide popup
    if (!show && showTimeout.current != null) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
      return;
    }
    hideTimeout.current = setTimeout(() => {
      console.log('hoverOut');
      setShow(false);
    }, DELAY);
    console.log('Started hideTimeout.'); 
  };

  const popupHoverIn = () => {
    console.log('popupHoverIn');
    // In case user moves out after moving inside the button, we don't show popup
    if (show && hideTimeout.current != null) {
      console.log('Cancelled hideTimeout.');
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
      return;
    }
  };

  const popupHoverOut = () => {
    console.log('popupHoverOut');
    hideTimeout.current = setTimeout(() => {
      console.log('hoverOut');
      setShow(false);
    }, DELAY);
  };

  const updateLike = async (post, user, payload) => {
    console.log('updateLike', post, user, payload);
    try {
      const result = await fetch(`/api/users/${user.uuid}/posts/${post.id}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(payload)
      });
      const json = await result.json();
      return json;
    }
    catch (e) {
      console.error(e);
    }
  };

  const onClickLike = async (value) => {
    console.log('onClickLike', value, user);
    setShow(false);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
    const result = await updateLike(post, user, {like: value});
  };

  return (
    <>
      <Row className='m-0 mt-1 mb-1'>
        <Col className='p-0'>
          <PostButton myRef={target} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} onClick={() => onClickLike(1)}>
            {/* <small className={post.liked ? 'post-action-like' : ''}><FaRegThumbsUp className='fs-4 pb-1' />Like</small> */}
            <LikeButtonIconText isLiked={post.liked} type={post.like_type} />
          </PostButton>
        </Col>
        <Col className='p-0'>
          <PostButton>
            <small><FaRegCommentAlt className='fs-6' /> Comment</small>
          </PostButton>
        </Col>
        <Col className='p-0'>
          <PostButton>
            <small><FaShare className='fs-5 pb-1' /> Share</small>
          </PostButton>
        </Col>
      </Row>
      <PostActionLikePopup show={show} target={target} popupHoverIn={popupHoverIn} popupHoverOut={popupHoverOut}>
        <LikeButtonPopupIcon type='like' onClick={onClickLike} />
        <LikeButtonPopupIcon type='love' onClick={onClickLike} />
        <LikeButtonPopupIcon type='care' onClick={onClickLike} />
        <LikeButtonPopupIcon type='laugh' onClick={onClickLike} />
        <LikeButtonPopupIcon type='sad' onClick={onClickLike} />
        <LikeButtonPopupIcon type='surprise' onClick={onClickLike} />
        <LikeButtonPopupIcon type='angry' onClick={onClickLike} />
      </PostActionLikePopup>
    </>
  );
};

export default PostActions;