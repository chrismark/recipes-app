import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem, Figure, OverlayTrigger, Fade } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import CardImgBadge from './CardImgBadge';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';

const SavedRecipe = ({ activeCardId, recipe, recipeIndex }) => {
  const target = useRef(null);
  const [showInfo, setShowInfo] = useState(false);
  const style = {
    // Make the images same size
    width: (recipe.aspect_ratio == '16:9' ? '177.5%' : '')
  };
  return (
    <Card 
      onMouseEnter={() => setShowInfo(true)} 
      onMouseLeave={() => setShowInfo(false)} 
      as={Link} 
      state={{ recipe }}
      to={`/saved-recipes/${recipe.slug}`}
      className='text-body text-decoration-none' 
      style={{overflow: 'hidden', position: 'relative'}} 
      border={activeCardId == recipe.id ? 'warning' : ''}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={style} />
      {(recipe.cook_time_minutes || recipe.prep_time_minutes || recipe.total_time_minutes || recipe.total_time_tier) && (
        <Fade in={showInfo}>
          <Card.Body style={{position: 'absolute', width: '100%', height: '100%'}} className='bg-white bg-opacity-75 text-left text-darker pt-0 mt-0'>
            <RecipeTimeInMinutes recipe={recipe} minimize={true} />
          </Card.Body>
        </Fade>
      )}
      <Card.Body style={{zIndex: 9999}}>
        <Card.Title>{recipe.name}</Card.Title>
      </Card.Body>
    </Card>
  );
};

export default SavedRecipe;