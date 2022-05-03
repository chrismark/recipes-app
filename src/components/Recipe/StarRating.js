import { useState } from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Star = ({ fullIf, halfIf, glow, onHover, onOut, onClick }) => {
  return (<Link 
    to='#' 
    className={'star-rating ' + (glow ? 'star-rating-hover' : '')} 
    onMouseOver={onHover} 
    onMouseLeave={onOut}
    onClick={(e) => { e.preventDefault(); onClick(); }}
  >
    {(fullIf || glow ? <FaStar /> : (halfIf ? <FaStarHalfAlt /> : <FaRegStar />))} 
  </Link>);
};

const StarRating = ({ rating }) => {
  const [glowVal, setGlowVal] = useState(0);

  const handleHover = (value) => {
    setGlowVal(value);
    console.log('handle hover: ', value);
  };

  const handleClick = (rating) => {
    console.log('rating: ', rating);
  }

  return (<div className='h2 mb-0' style={{marginTop: '-.2rem'}}>
    <Star fullIf={rating >= 1} halfIf={rating === 0.5} glow={glowVal >= 1} onHover={() => handleHover(1)} onOut={() => handleHover(0)} onClick={() => handleClick(1)} /> 
    <Star fullIf={rating >= 2} halfIf={rating === 1.5} glow={glowVal >= 2} onHover={() => handleHover(2)} onOut={() => handleHover(0)} onClick={() => handleClick(2)} /> 
    <Star fullIf={rating >= 3} halfIf={rating === 2.5} glow={glowVal >= 3} onHover={() => handleHover(3)} onOut={() => handleHover(0)} onClick={() => handleClick(3)} /> 
    <Star fullIf={rating >= 4} halfIf={rating === 3.5} glow={glowVal >= 4} onHover={() => handleHover(4)} onOut={() => handleHover(0)} onClick={() => handleClick(4)} /> 
    <Star fullIf={rating >= 5} halfIf={rating === 4.5} glow={glowVal === 5} onHover={() => handleHover(5)} onOut={() => handleHover(0)} onClick={() => handleClick(5)} />
  </div>);
};

export default StarRating;

StarRating.defaultProps = {
  rating: 0
};//
