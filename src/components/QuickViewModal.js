import { Figure, Modal, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import { isStringNotNullOrEmpty } from '../lib';

const QuickViewModal = ({ recipe, show, onClose }) => {

  return (
    <Modal show={show} onHide={onClose} size='lg' centered>
      <Modal.Header closeButton>
        <Modal.Title>{recipe.name}</Modal.Title>
      </Modal.Header>
      <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
          <Col md='auto'>
            <Figure style={{marginBottom: 0}}>
              <Figure.Image src={recipe.thumbnail_url} style={{maxHeight: '50vh', marginBottom: 0}} />
            </Figure> 
          </Col>
        </Row>
      <Modal.Body>        
        {isStringNotNullOrEmpty(recipe.description) && (
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
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;