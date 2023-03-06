import { useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';

const PostActionLikePopup = ({children, target, show, popupHoverIn, popupHoverOut}) => {
  const hasScheduledUpdateRef = useRef(false);
  return (
    <Overlay 
      target={target.current} 
      show={show} 
      placement='top-start'
      flip={true}
      >
      {({ placement, arrowProps, show: _show, popper, ...props }) => {
        if (hasScheduledUpdateRef.current == false) {
          hasScheduledUpdateRef.current = true;
          popper.scheduleUpdate();
        }
        return <div
          {...props}
          style={{
            position: 'absolute',
            paddingTop: '0.5rem',
            paddingBottom: '0.1rem',
            paddingLeft: '.7rem',
            paddingRight: '0.5rem',
            backgroundColor: 'white',
            borderRadius: '1.5rem 1.5rem',
            border: '1px solid gray',
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
      }}
    </Overlay>
  );
};

export default PostActionLikePopup;