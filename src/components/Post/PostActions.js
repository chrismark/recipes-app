import { useState, useRef } from 'react';
import { Row, Col, Overlay } from 'react-bootstrap';
import { FaRegThumbsUp, FaRegCommentAlt, FaShare, FaRegHeart, FaRegGrinHearts, FaRegGrinSquint, FaRegSadTear, FaRegSurprise, FaRegAngry } from 'react-icons/fa';
import PostButton from './PostButton';

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
        <Col className='pt-1 pb-1'>
          <PostButton myRef={target} onHoverIn={handleHoverIn} onHoverOut={handleHoverOut}>
            <small><FaRegThumbsUp className='fs-4 pb-1' />Like</small>
          </PostButton>
        </Col>
        <Col className='pt-1 pb-1'>
          <PostButton>
            <small><FaRegCommentAlt /> Comment</small>
          </PostButton>
        </Col>
        <Col className='pt-1 pb-1'>
          <PostButton>
            <small><FaShare className='fs-5 pb-1' /> Share</small>
          </PostButton>
        </Col>
      </Row>
      <Overlay target={target.current} show={show} placement="top">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              position: 'absolute',
              padding: '2px 10px',
              color: 'white',
              borderRadius: 3,
              cursor: 'pointer',
              ...props.style,
            }}
            onMouseEnter={popupHoverIn}
            onMouseLeave={popupHoverOut}
          >
            <span className='fs-2 bg-white'>
              <FaRegThumbsUp className='post-action post-action-like cursor-pointer' style={{color: 'blue'}} />
              <FaRegHeart className='post-action-icon post-action-heart cursor-pointer' style={{color: 'red'}} />
              <FaRegGrinHearts className='post-action-icon post-action-heart-eyes cursor-pointer' />
              <FaRegGrinSquint className='post-action-icon post-action-laugh cursor-pointer' />
              <FaRegSadTear className='post-action-icon post-action-sad cursor-pointer' />
              <FaRegSurprise className='post-action-icon post-action-surprise cursor-pointer' />
              <FaRegAngry className='post-action-icon post-action-angry cursor-pointer' />
            </span>
          </div>
        )}
      </Overlay>
    </>
  );
};

export default PostActions;