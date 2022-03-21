import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, ListGroup, ListGroupItem } from 'react-bootstrap';

const RecipeShort = ({ isCompilation, recipe, compilationIndex, recipeIndex, onQuickViewSidebar }) => {
  const style = {
    width: (recipe.aspect_ratio == '16:9' ? '177.5%' : '')
  };
  return (
    <Card style={{overflow: 'hidden'}}>
      <Card.Img variant='top' src={recipe.thumbnail_url} style={style} />
      <Card.Body>
        <Card.Title>{recipe.name}</Card.Title>
        {/* <Card.Text style={{fontSize: '0.8em'}}>{recipe.tags.length > 0 ? 'Tags: ' + recipe.tags.map(tag => tag.display_name).join(', ') : ''}</Card.Text> */}
      </Card.Body>
      <ListGroup className='list-group-flush'>
        {isCompilation ? 
          (<ListGroupItem as={Link} to='#' onClick={() => onQuickViewSidebar(recipeIndex, compilationIndex)} style={{textAlign: 'center'}}>View Compilation</ListGroupItem>)
          :
          (<>
            <ListGroupItem as={Link} to='#' onClick={() => onQuickViewSidebar(recipeIndex, compilationIndex)} style={{textAlign: 'center'}}>Quick view of the recipe</ListGroupItem>
            <ListGroupItem as={Link} to='#' onClick={() => console.log('Saving recipe ' + recipe.name)} style={{textAlign: 'center'}}>Or, save it then rate and comment</ListGroupItem>
          </>)
        } 
      </ListGroup>
    </Card>
  );
};

RecipeShort.defaultProps = {
  isCompilation: false
}

export default RecipeShort;