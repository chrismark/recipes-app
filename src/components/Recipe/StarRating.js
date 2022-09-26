import { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Star = ({ fullIf, halfIf, glow, onHover, onOut, onClick, disabled }) => {
  return (<Link disabled={disabled}
    to='#' 
    className={'star-rating ' + (glow && !disabled ? 'star-rating-hover' : '') + (disabled ? 'star-rating-disabled' : '')} 
    onMouseOver={onHover} 
    onMouseLeave={onOut}
    onClick={(e) => { e.preventDefault(); if (disabled) { return; } onClick(); }}
  >
    {(fullIf || glow ? <FaStar /> : (halfIf ? <FaStarHalfAlt /> : <FaRegStar />))} 
  </Link>);
};

const StarRating = ({ rating, onClick, disabled }) => {
  const [glowVal, setGlowVal] = useState(0);

  const handleHover = (value) => {
    setGlowVal(value);
  };

  return (
<div className='h2 mb-0' style={{marginTop: '-.2rem'}}>
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
</div>
  );
};

export default StarRating;

StarRating.defaultProps = {
  rating: 0,
  onClick: (rating) => { console.log('rating: ', rating); }
};
