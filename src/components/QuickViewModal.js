import { Figure, Modal, Row, Col, ListGroup, ListGroupItem } from 'react-bootstrap';
import { isStringNotNullOrEmpty } from '../lib';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';

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
            <h4 className='fw-bolder' style={{marginBottom: 0}}>Ingredients</h4>
            <h5>for {recipe.num_servings} {recipe.num_servings > 1 ? recipe.servings_noun_plural : recipe.servings_noun_singular}</h5>
            {recipe.sections.length > 0 ? recipe.sections.map(section => (<>
              {(section.name && section.name.length > 0) ? (
                <h5 className='fw-bold' style={{marginTop:'2vh'}}>{section.name.toUpperCase()}</h5>
              ) : (<div className='mt-3'></div>)}
              <Row xs={1}>
                {section.components.map(component => (
                  <Col className='fs-5 mb-1'>
                    {component.raw_text} 
                    {component.measurements.length > 1 
                      ? ` (${component.measurements[1].quantity} ${component.measurements[1].unit.display_plural})` 
                      : ''}
                  </Col>
                ))}
                
              </Row>
            </>)) : ''}
            {(recipe.nutrition && Object.keys(recipe.nutrition).length > 0) ? (<>
              <h4 className='fw-bolder mt-4'>Nutrition Info</h4>
              <Row xs={1}>
                {Object.keys(recipe.nutrition).filter(name => name !== 'updated_at').map(name => (
                  <Col className='fs-5'>{`${name} ${recipe.nutrition[name]}`}</Col>
                ))}
                <Col className='fs-6 mt-3'>Estimated values based on one serving size.</Col>
              </Row>
            </>) : ''}
          </Col>
          <Col className='mt-4'>
            <h4 className='fw-bolder'>Preparation</h4>
            <Row as='ol' xs={1}>
            {recipe.instructions.length > 0 ? recipe.instructions.map(instruction => (
              <Col as='li' className='fs-5 mb-3'>
                <div>{instruction.display_text}</div>
              </Col>
            )) : ''}
            </Row>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewModal;