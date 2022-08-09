import { useState, useEffect, useRef } from 'react';
import { Form, Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const RecipeCaptionEntryForm = ({ recipe, initialize, updateLocalSelectedRecipes }) => {
  const controlRef = useRef(null);
  console.log('RecipeCaptionEntryForm::initialize = ', initialize);
  console.log('recipe.caption = ', recipe.caption);

  useEffect(() => {
    if (controlRef.value != null) {
      controlRef.value.value = initialize ? recipe.caption : '';
    }
  }, [initialize]);

  const onCaptionChange = (e) => {
    recipe.caption = e.target.value;
    updateLocalSelectedRecipes();
  }

  return (
    <Card
      className='text-body text-decoration-none cursor-pointer' 
      style={{overflow: 'hidden', position: 'relative', border: 0}}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : ''),
        borderBottomLeftRadius: 'calc(0.25rem - 1px)',
        borderBottomRightRadius: 'calc(0.25rem - 1px)'
      }} />
      <Card.Body className='m-0 p-0 border-none'>
        <Form.Control
          ref={controlRef}
          className='mt-2'
          as='textarea'
          placeholder={"Caption"}
          rows={3}
          onChange={onCaptionChange}
          value={recipe.caption}
          />
      </Card.Body>
    </Card>
  );
};

const AddRecipeCaptionModal = ({ show, onDone, onClose, selectedRecipes, setSelectedRecipes }) => {
  console.log('AddRecipeCaptionModal::rendering show=', show);
  const [localSelectedRecipes, setLocalSelectedRecipes] = useState([]);

  useEffect(() => {
    console.log('SelectRecipeModal::mounted');
    return () => console.log('SelectRecipeModal::unmounted');
  }, []);

  useEffect(() => {
    console.log('show or recipes changed.');

    if (show) {
      updateLocalFromSelectedRecipes();
    }
  }, [show]);

  const updateLocalFromSelectedRecipes = () => {
    setLocalSelectedRecipes([...selectedRecipes]);
  };

  const updateLocalSelectedRecipes = () => {
    setLocalSelectedRecipes([...localSelectedRecipes]);
  };

  const onClickDone = () => {
    console.log('Done Adding Captions');
    setSelectedRecipes([...localSelectedRecipes]);
    setLocalSelectedRecipes([]);
    onDone();
  };

  const onClickBack = () => {
    console.log('Back');
    setLocalSelectedRecipes([]);
    onClose();
  };

  return (
    <Modal show={show} size='md' backdrop={false} scrollable>
      <Modal.Header>
        <Modal.Body className='m-0 p-0' style={{overflow: 'hidden'}}>
          <Row className=''>
            <Col md={1}>
              <div className='text-center' onClick={onClickBack}>
                <span className='h5 cursor-pointer'><FaLongArrowAltLeft className='fs-3' /></span>
              </div>
            </Col>
            <Col md={10} className='text-center'>
              <h5 className='m-0'>Add Captions</h5>
            </Col>
          </Row>  
        </Modal.Body>
      </Modal.Header>
      <Modal.Body>
        <Row className='gy-4'>
          {localSelectedRecipes && localSelectedRecipes.length > 0 && localSelectedRecipes.map((recipe, idx) => (
            <Col key={recipe.id} xs={12}>
              <RecipeCaptionEntryForm 
                recipe={recipe} 
                updateLocalSelectedRecipes={updateLocalSelectedRecipes} 
                initialize={show}
                />
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col className='d-grid p-0' md='auto' style={{textAlign: 'right'}}>
            <Button 
              variant={'primary'}
              type='submit' 
              size='md'
              onClick={onClickDone}
              >Done</Button>
          </Col>
        </Row>  
      </Modal.Footer>
    </Modal>
  );
};

export default AddRecipeCaptionModal;