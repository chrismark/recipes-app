import { useState, useRef } from 'react';

const PostButton = ({children, myRef, onClick, onHoverIn, onHoverOut}) => {
  const dummy = () => {};
  return (
    <div ref={myRef}
      className='post-action text-center cursor-pointer pt-1 pb-1 rounded fw-bolder text-muted' 
      onClick={onClick || dummy}
      onMouseEnter={onHoverIn || dummy} 
      onMouseLeave={onHoverOut || dummy}>
      {children}
    </div>
  );
};

export default PostButton;