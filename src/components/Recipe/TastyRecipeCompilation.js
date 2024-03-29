import { Card, Accordion, ListGroup, ListGroupItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import CustomAccordionToggle from './CustomAccordionToggle';
import CustomBadge from './CustomBadge';
import CardImgBadge from './CardImgBadge';
import { isStringNotNullOrEmpty } from '../../lib';


const QuickRecipeCompilation = ({ activeCardId, isNew, compilation, compilationIndex, onView }) => {
  console.log('QuickRecipeCompilation');
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;
  const isDescriptionNotEmpty = isStringNotNullOrEmpty(compilation.description);

  const replaceLinksWithText = (text) => {
    let result = null;
    let copyText = text;
    while ((result = regexLink.exec(text))) {
      copyText = copyText.replace(result[0], result[2]);
    }
    return copyText;
  };
  return (
    <Card as={Accordion} flush key={compilation.id} border={activeCardId === compilation.id ? 'warning' : ''}>
      <Card.Img variant='top' src={compilation.thumbnail_url} />
      {isNew && (<CardImgBadge type='danger' overCardImg>new</CardImgBadge>)}
      <Card.Body>
        <Card.Title>
          <CustomBadge type='info'>compilation</CustomBadge>
          <CustomAccordionToggle eventKey="0" showToggle={isDescriptionNotEmpty}>{compilation.name}</CustomAccordionToggle>
        </Card.Title>
        <Accordion.Collapse eventKey='0'>
          <>{replaceLinksWithText(compilation.description)}</>
        </Accordion.Collapse>
      </Card.Body>
      <ListGroup className='list-group-flush'>
        <ListGroupItem as={Link} to='#' onClick={() => onView(compilationIndex)} style={{textAlign: 'center'}}>View Compilation</ListGroupItem>
      </ListGroup>
    </Card>
  );
}; 

QuickRecipeCompilation.defaultProps = {
  onSave: (recipe) => console.log('Saving recipe ' + recipe.name),
};

export default QuickRecipeCompilation;