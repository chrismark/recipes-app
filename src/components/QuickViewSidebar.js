import { Offcanvas, Figure, ListGroup, ListGroupItem, Row, Col, Image } from 'react-bootstrap';
import { isStringNotNullOrEmpty } from '../lib';
import RecipeCredits from './RecipeCredits';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';

const QuickViewSidebar = ({ show, onClose, recipe }) => {
  const isDescriptionNotEmpty = isStringNotNullOrEmpty(recipe.description);

  return (
    <Offcanvas show={show} onHide={onClose} scroll={true}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title><h3>{recipe.name}</h3></Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Figure>
          <Figure.Image src={recipe.thumbnail_url} />
        </Figure>
        {isDescriptionNotEmpty && (
          <Row>
            <Col><p className='fs-5'>{recipe.description}</p></Col>
          </Row>
        )}
        {(recipe && recipe.credits.length > 0) && (
          <Row>
            <Col><RecipeCredits recipe={recipe} /></Col>
          </Row>
        )}
        <RecipeTimeInMinutes recipe={recipe} />
        
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default QuickViewSidebar;