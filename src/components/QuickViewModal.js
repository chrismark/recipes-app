import { Figure, Modal, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { isStringNotNullOrEmpty } from '../lib';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import RecipeNutrition from './RecipeNutrition';
import RecipePreparation from './RecipePreparation';

const QuickViewModal = ({ recipe, show, onClose }) => {

  return (
    <Modal show={show} onHide={onClose} size='xl' xs={2} centered>
      <Modal.Header closeButton>
        <Modal.Title><h2>{recipe.name}</h2></Modal.Title>
      </Modal.Header>
      <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
        <Col md='auto'>
          <Figure style={{marginBottom: 0}}>
            <Figure.Image src={recipe.thumbnail_url} style={{maxHeight: '50vh', marginBottom: 0}} />
          </Figure> 
        </Col>
      </Row>
      <Modal.Body>        
        <RecipeDescription recipe={recipe} />
        <RecipeCredits recipe={recipe} />
        <RecipeTimeInMinutes recipe={recipe} />
        <Row lg={2} xs={1}>
          <Col className='mt-4'>
            <RecipeIngredients recipe={recipe} />
            <RecipeNutrition recipe={recipe} />
          </Col>
          <Col className='mt-4'>
            <RecipePreparation recipe={recipe} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;