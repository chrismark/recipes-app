import { Link } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import CardImgBadge from './CardImgBadge';
import { BsReplyAll } from 'react-icons/bs';

const QuickRecipe = ({ activeCardId, isNew, recipe, recipeIndex, onView, onSave }) => {
  return (
    <Card style={{overflow: 'hidden'}} border={activeCardId === recipe.id ? 'warning' : ''}>
      <Card.Img variant='top' src={recipe.thumbnail_url} />
      {isNew && (<CardImgBadge type='danger'>new</CardImgBadge>)}
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        {/* <Card.Text style={{fontSize: '0.8em'}}>{recipe.tags.length > 0 ? 'Tags: ' + recipe.tags.map(tag => tag.display_name).join(', ') : ''}</Card.Text> */}
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem as={Link} to='#' onClick={() => onView(recipeIndex)} style={{textAlign: 'center'}}>Quick view of the recipe</ListGroupItem>
        <ListGroupItem as={Link} to='#' onClick={() => onSave(recipe)} style={{textAlign: 'center'}}>Or, save it then rate and comment</ListGroupItem>
      </ListGroup>
    </Card>
  );
};

QuickRecipe.defaultProps = {
  onSave: (recipe) => console.log('Saving recipe ' + recipe.name),
};

export default QuickRecipe;