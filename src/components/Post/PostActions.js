import { useState, useRef } from 'react';
import { Row, Col, Overlay } from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaRegThumbsUp, FaRegCommentAlt, FaShare, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import PostButton from './PostButton';

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

const PostActions = ({onLike, onShowComments}) => {
  const target = useRef(null);
  const showTimeout = useRef(null);
  const hideTimeout = useRef(null);
  const hoverOnPopup = useRef(false);
  const hoverOnButton = useRef(false);
  const [show, setShow] = useState(false);
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

  return (
    <>
      <Row className='m-0 mt-1 mb-1'>
        <Col className='p-0 pt-1 pb-1'>
          <PostButton myRef={target} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
            <small><FaRegThumbsUp className='fs-4 pb-1' />Like</small>
          </PostButton>
        </Col>
        <Col className='p-0 pt-1 pb-1'>
          <PostButton>
            <small><FaRegCommentAlt /> Comment</small>
          </PostButton>
        </Col>
        <Col className='p-0 pt-1 pb-1'>
          <PostButton>
            <small><FaShare className='fs-5 pb-1' /> Share</small>
          </PostButton>
        </Col>
      </Row>
      <PostActionLikePopup show={show} target={target} popupHoverIn={popupHoverIn} popupHoverOut={popupHoverOut}>
        <PostActionLikeTooltip text='Like'>
          <FaRegThumbsUp className='post-action-icon post-action-like cursor-pointer' style={{color: 'blue'}} />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Love'>
          <FaRegHeart className='post-action-icon post-action-heart cursor-pointer' style={{color: 'red'}} />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Care'>
          <FaRegGrinHearts className='post-action-icon post-action-heart-eyes cursor-pointer' />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Laugh'>
          <FaRegGrinSquint className='post-action-icon post-action-laugh cursor-pointer' />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Sad'>
          <FaRegSadTear className='post-action-icon post-action-sad cursor-pointer' />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Surprise'>
          <FaRegSurprise className='post-action-icon post-action-surprise cursor-pointer' />
        </PostActionLikeTooltip>
        <PostActionLikeTooltip text='Angry'>
          <FaRegAngry className='post-action-icon post-action-angry cursor-pointer' />
        </PostActionLikeTooltip>
      </PostActionLikePopup>
      
    </>
  );
};

export default PostActions;