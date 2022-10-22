import { useEffect, useState, useRef } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Star = ({ fullIf, halfIf, glow, onHover, onOut, onClick, disabled }) => {
  return (<Link disabled={disabled}
    to='#' 
    className={'star-rating ' + (glow && !disabled ? 'star-rating-hover' : '') + (disabled ? 'star-rating-disabled' : '')} 
    onMouseEnter={onHover} 
    onMouseLeave={onOut}
    onClick={(e) => { 
      e.preventDefault(); 
      if (disabled) { return; } 
      onClick();
    }}
  >
    {(fullIf || glow ? <FaStar /> : (halfIf ? <FaStarHalfAlt /> : <FaRegStar />))} 
  </Link>);
};

const StarRating = ({ rating, onClick, disabled }) => {
  const [glowVal, setGlowVal] = useState(0);
  const starDivRef = useRef(null);

  useEffect(() => {
    const mouseMoveHandler = (e) => {
      if (glowVal > 0 && starDivRef.current != null) {
        const starDivRect = starDivRef.current.getBoundingClientRect();
        const insideStarX = e.x >= starDivRect.x && e.x <= (starDivRect.x + starDivRect.width);
        const insideStarY = e.y >= starDivRect.y && e.y <= (starDivRect.y + starDivRect.height);
        // check if no overlap but isHovering is still true then reset
        if (insideStarX && insideStarY) {
        }
        else if (glowVal > 0) {
          // Reset glow val so the stars aren't 'glowing' when mouse is out
          // Note: This is a fix for issue where sometimes star component remains 'glowing' when user moves mouse over it quickly
          setGlowVal(gV => 0);
        }
      }
    };
    document.addEventListener('mousemove', mouseMoveHandler);
    return () => {
      document.removeEventListener('mousemove', mouseMoveHandler);
    };
  }, [glowVal]);

  const handleHover = (value) => {
    setGlowVal(value);
  };

  return (
<div className='h2 mb-0' style={{marginTop: '-.2rem'}}>
  <span ref={starDivRef} onOut={() => handleHover(0)}>
  <Star fullIf={rating >= 1} halfIf={rating === 0.5} glow={glowVal >= 1} onHover={() => handleHover(1)} 
    onOut={() => handleHover(0)} onClick={() => onClick(1)} disabled={disabled} />
<Star fullIf={rating >= 2} halfIf={rating === 1.5} glow={glowVal >= 2} onHover={() => handleHover(2)} 
    onOut={() => handleHover(0)} onClick={() => onClick(2)} disabled={disabled} />
<Star fullIf={rating >= 3} halfIf={rating === 2.5} glow={glowVal >= 3} onHover={() => handleHover(3)} 
    onOut={() => handleHover(0)} onClick={() => onClick(3)} disabled={disabled} />
<Star fullIf={rating >= 4} halfIf={rating === 3.5} glow={glowVal >= 4} onHover={() => handleHover(4)} 
    onOut={() => handleHover(0)} onClick={() => onClick(4)} disabled={disabled} />
<Star fullIf={rating >= 5} halfIf={rating === 4.5} glow={glowVal === 5} onHover={() => handleHover(5)} 
    onOut={() => handleHover(0)} onClick={() => onClick(5)} disabled={disabled} />
  </span>  
</div>
  );
};

export default StarRating;

StarRating.defaultProps = {
  rating: 0,
  onClick: (rating) => { console.log('rating: ', rating); }
};
