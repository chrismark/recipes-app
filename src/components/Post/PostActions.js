import { useState, useRef, useContext, createElement } from 'react';
import { Row, Col, Overlay } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaRegThumbsUp, FaRegCommentAlt, FaShare, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import PostButton from './PostButton';
import { AppContext } from '../../app-context.js';

const PostActionLikePopup = ({children, target, show, popupHoverIn, popupHoverOut}) => {
  return (
    <Overlay target={target.current} show={show} placement="top-start">
      {({ placement, arrowProps, show: _show, popper, ...props }) => (
        <div
          {...props}
          style={{
            position: 'absolute',
            paddingBottom: '.1rem',
            color: 'white',
            borderRadius: 3,
            cursor: 'pointer',
            zIndex: 999999,
            ...props.style,
          }}
          onMouseEnter={popupHoverIn}
          onMouseLeave={popupHoverOut}
        >
          <span className='fs-1 bg-white d-inline-flex'>
            {children}
          </span>
        </div>
      )}
    </Overlay>
  );
};

const PostActionLikeTooltip = ({children, text}) => {
  return (
    <OverlayTrigger
        key={text}
        placement='top'
        overlay={
          <Tooltip id={`tooltip-${text}`}>{text}</Tooltip>
        }
      >
      <span className='d-inline-flex'>{children}</span>
    </OverlayTrigger>
  );
};

const LikeTypes = {
  'like': { text: 'Like', value: 1, tag: FaRegThumbsUp },
  'love': { text: 'Love', value: 2, tag: FaRegHeart },
  'care': { text: 'Care', value: 3, tag: FaRegGrinHearts },
  'laugh': { text: 'Laugh', value: 4, tag: FaRegGrinSquint },
  'sad': { text: 'Sad', value: 5, tag: FaRegSadTear },
  'surprise': { text: 'Surprise', value: 6, tag: FaRegSurprise },
  'angry': { text: 'Angry', value: 7, tag: FaRegAngry },
};

const LikeButton = ({ type, onClick }) => {
  let data = LikeTypes[type];
  const Tag = data.tag;
  const text = data.text;
  const handler = () => onClick(data.value);
  const button = <Tag className={'post-action-icon cursor-pointer post-action-' + type} onClick={handler} />
  return (
    <OverlayTrigger
        key={text}
        placement='top'
        overlay={
          <Tooltip id={`tooltip-${text}`}>{text}</Tooltip>
        }
      >
      <span className='d-inline-flex'>{button}</span>
    </OverlayTrigger>
  );
};

const PostActions = ({post, onLike, onShowComments}) => {
  console.log('PostActions post', post);
  const target = useRef(null);
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);
  const hoverOnPopup = useRef(false);
  const hoverOnButton = useRef(false);
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
    const result = await updateLike(post, user, {like: value});
  };

  return (
    <>
      <Row className='m-0 mt-1 mb-1'>
        <Col className='p-0 pt-1 pb-1'>
          <PostButton myRef={target} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
            <small><FaRegThumbsUp className='fs-4 pb-1' />Like</small>
          </PostButton>
        </Col>
        <Col className='p-0 pt-1 pb-3'>
          <PostButton>
            <small><FaRegCommentAlt className='fs-6' /> Comment</small>
          </PostButton>
        </Col>
        <Col className='p-0 pt-1 pb-1'>
          <PostButton>
            <small><FaShare className='fs-5 pb-1' /> Share</small>
          </PostButton>
        </Col>
      </Row>
      <PostActionLikePopup show={show} target={target} popupHoverIn={popupHoverIn} popupHoverOut={popupHoverOut}>
        <LikeButton type='like' onClick={onClickLike} />
        <LikeButton type='love' onClick={onClickLike} />
        <LikeButton type='care' onClick={onClickLike} />
        <LikeButton type='laugh' onClick={onClickLike} />
        <LikeButton type='sad' onClick={onClickLike} />
        <LikeButton type='surprise' onClick={onClickLike} />
        <LikeButton type='angry' onClick={onClickLike} />
      </PostActionLikePopup>
    </>
  );
};

export default PostActions;