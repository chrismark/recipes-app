import { useState, useEffect } from 'react';
import { Button, Card, Carousel, Accordion, useAccordionButton, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
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
    <Card as={Accordion} flush key={compilation.id}>
      <Card.Img variant='top' src={compilation.thumbnail_url} />
      <Card.Body>
        <Card.Title>
          <h6 style={{marginTop: '-.4em'}}><small>compilation</small></h6>
          <CustomAccordionToggle eventKey="0">{compilation.name}</CustomAccordionToggle>
        </Card.Title>
        <Accordion.Collapse eventKey='0'>
          <>{replaceLinksWithText(compilation.description)}</>
        </Accordion.Collapse>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem as={Link} to='#' onClick={() => onQuickViewSidebar(compilationIndex)} style={{textAlign: 'center'}}>View Compilation</ListGroupItem>
      </ListGroup>
    </Card>
  );
}; 

export default RecipeCompilation;