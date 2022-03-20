import { useState, useEffect } from 'react';
import { Button, Card, Carousel, Accordion, useAccordionButton } from 'react-bootstrap';
import RecipeShort from './RecipeShort';
import CustomAccordionToggle from './CustomAccordionToggle';


const RecipeCompilation = ({ compilation, compilationIndex, onQuickViewSidebar }) => {
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;
  
  const replaceLinksWithText = (text) => {
    let result = null;
    let copyText = text;
    while (result = regexLink.exec(text)) {
      copyText = copyText.replace(result[0], result[2]);
    }
    return copyText;
  };

  return (
    <Carousel variant='dark' interval={null} indicators={false} className='recipe-compilaton'>
      <Carousel.Item key={compilation.id}>
        <Card as={Accordion} flush style={{ width: '18rem'}}>
          <Card.Img variant='top' src={compilation.thumbnail_url} />
          <Card.Body>
            <Card.Title>
              <h6 style={{marginTop: '-.4em'}}><small>compilation</small></h6>
              {compilation.name} <CustomAccordionToggle eventKey="0" />
            </Card.Title>
            <Accordion.Collapse eventKey='0'>
              <>{replaceLinksWithText(compilation.description)}</>
            </Accordion.Collapse>
          </Card.Body>
        </Card>
      </Carousel.Item>
      {compilation.recipes.map((recipe, recipeIndex) => (
        <Carousel.Item key={recipe.id}>
          <RecipeShort recipe={recipe} compilationIndex={compilationIndex} recipeIndex={recipeIndex} onQuickViewSidebar={onQuickViewSidebar} />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}; 

export default RecipeCompilation;