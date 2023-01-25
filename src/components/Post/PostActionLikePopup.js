import Overlay from 'react-bootstrap/Overlay';

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

export default PostActionLikePopup;