import { useState, useRef, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaRegCommentAlt, FaShare } from 'react-icons/fa';
import PostButton from './PostButton';
import { AppContext } from '../../appContext.js';
import PostActionLikePopup from './PostActionLikePopup';
import { LikeButtonPopupIcon, LikeButtonIconText } from './LikeButton';
import { LikeTypes } from './LikeButton';

const PostActions = ({post, recipeIndex, onLike, onUnlike, onShowComments}) => {
  // TODO: Why does this rerender on all posts?
  const target = useRef(null);
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);
  const [show, setShow] = useState(false);
  const [{ user }] = useContext(AppContext);
  const source = recipeIndex == -1 ? post : post.recipes[recipeIndex];
  const DELAY = 1200;
  // console.log('PostActions source', source);

  const handleHoverIn = () => {
    // console.log('handleHoverIn show=', show);
    // In case user moves out after moving inside the button, we don't show popup
    if (show && hideTimeout.current != null) {
      // console.log('Cancelled hideTimeout.');
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
      return;
    }
    showTimeout.current = setTimeout(() => {
      // console.log('hoverIn');
      setShow(true);
    }, DELAY);
  };

  const handleHoverOut = () => {
    // console.log('handleHoverOut show=', show);
    // In case user moves back in after moving out of button, we don't hide popup
    if (!show && showTimeout.current != null) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
      return;
    }
    hideTimeout.current = setTimeout(() => {
      // console.log('hoverOut');
      setShow(false);
    }, DELAY);
    // console.log('Started hideTimeout.'); 
  };

  const popupHoverIn = () => {
    // console.log('popupHoverIn');
    // In case user moves out after moving inside the button, we don't show popup
    if (show && hideTimeout.current != null) {
      // console.log('Cancelled hideTimeout.');
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
      return;
    }
  };

  const popupHoverOut = () => {
    // console.log('popupHoverOut');
    hideTimeout.current = setTimeout(() => {
      // console.log('hoverOut');
      setShow(false);
    }, DELAY);
  };

  const onClickLike = (value) => {
    console.log('onClickLike', source, value, user);
    setShow(s => false);
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    if (showTimeout.current) {
      clearTimeout(showTimeout.current);
      showTimeout.current = null;
    }
    const payload = {
      like: value
    };
    if (source.like_type != null) {
      payload.prev = LikeTypes[source.like_type].value;
    }
    console.log('payload', payload);
    console.log('param', {post, recipeIndex, user, payload});
    if (payload.like == payload.prev) {
      delete payload.prev;
      onUnlike({post, recipeIndex, user, payload});
    }
    else {
      onLike({post, recipeIndex, user, payload});
    }
  };

  return (
    <>
      <Row className='m-0 mt-1 mb-1'>
        <Col className='p-0'>
          <PostButton myRef={target} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} onClick={() => onClickLike(source.liked ? LikeTypes[source.like_type].value : 1)}>
            <LikeButtonIconText isLiked={source.liked} type={source.like_type} />
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

PostActions.defaultProps = {
  recipeIndex: -1,
};

export default PostActions;