import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const RecipeShort = ({ recipe, compilationIndex, recipeIndex, onQuickViewSidebar }) => {
  return (
    <Card style={{ width: '18rem'}}>
      <Card.Img variant='top' src={recipe.thumbnail_url} />
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        {/* <Card.Text style={{fontSize: '0.8em'}}>{recipe.tags.length > 0 ? 'Tags: ' + recipe.tags.map(tag => tag.display_name).join(', ') : ''}</Card.Text> */}
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem as={Link} to='#' onClick={() => onQuickViewSidebar(recipeIndex, compilationIndex)} style={{textAlign: 'center'}}>Quick view of the recipe</ListGroupItem>
        <ListGroupItem as={Link} to='#' onClick={() => console.log('Saving recipe ' + recipe.name)} style={{textAlign: 'center'}}>Or, save it then rate and comment</ListGroupItem>
      </ListGroup>
    </Card>
  );
};

export default RecipeShort;