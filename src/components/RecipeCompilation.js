import { useState, useEffect } from 'react';
import { Badge, Button, Card, Carousel, Accordion, useAccordionButton, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomAccordionToggle from './CustomAccordionToggle';
import CustomBadge from './CustomBadge';
import CardImgBadge from './CardImgBadge';


const RecipeCompilation = ({ isNew, compilation, compilationIndex, onQuickViewSidebar }) => {
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
      {isNew && (<CardImgBadge type='danger' overCardImg>new</CardImgBadge>)}
      <Card.Body>
        <Card.Title>
          <CustomBadge type='info'>compilation</CustomBadge>
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