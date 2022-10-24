import { useState, useEffect, useRef } from 'react';
import { Form, Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const RecipeCaptionEntryForm = ({ recipe, recipesCaption, initialize, updateCaption }) => {
  const controlRef = useRef(null);
  console.log('RecipeCaptionEntryForm::initialize = ', initialize);
  console.log('recipe.caption = ', recipe.caption);
  
  useEffect(() => {
    if (controlRef.value != null) {
      controlRef.value.value = initialize ? recipe.caption : '';
    }
  }, [initialize]);

  const onCaptionChange = (e) => {
    updateCaption(recipe.id, e.target.value);
  }

  return (
    <Card
      className='text-body text-decoration-none' 
      style={{overflow: 'hidden', position: 'relative', border: 0}}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : ''),
        borderBottomLeftRadius: 'calc(0.25rem - 1px)',
        borderBottomRightRadius: 'calc(0.25rem - 1px)'
      }} className='user-select-none' />
      <Card.Body className='m-0 p-0 border-none'>
        <Form.Control
          ref={controlRef}
          className='mt-2'
          as='textarea'
          placeholder={"Caption"}
          rows={3}
          onBlur={onCaptionChange}
          defaultValue={recipesCaption[recipe.id]}
          />
      </Card.Body>
    </Card>
  );
};

const AddRecipeCaptionModal = ({ show, onDone, onClose, selectedRecipes, setSelectedRecipes }) => {
  console.log('AddRecipeCaptionModal::rendering show=', show);
  const [localSelectedRecipes, setLocalSelectedRecipes] = useState([]);
  const [localSelectedRecipesCaption, setLocalSelectedRecipesCaption] = useState({});

  useEffect(() => {
    console.log('AddRecipeCaptionModal::mounted');
    return () => console.log('AddRecipeCaptionModal::unmounted');
  }, []);

  useEffect(() => {
    console.log('show or recipes changed.');

    if (show) {
      initLocalSelectedRecipes();
    }
  }, [show]);

  const initLocalSelectedRecipes = () => {
    console.log('Update Local Selected Recipes using selectedRecipes.');
    setLocalSelectedRecipes([...selectedRecipes]);
    // copy caption to local map
    selectedRecipes.map(r => { 
      localSelectedRecipesCaption[r.id] = r.caption ? r.caption : ''; 
    });
    setLocalSelectedRecipesCaption(JSON.parse(JSON.stringify(localSelectedRecipesCaption)));
  };

  const updateLocalSelectedRecipesCaption = (recipeId, caption) => {
    console.log('Update Local Selected Recipes using localSelectedRecipes.');
    localSelectedRecipesCaption[recipeId] = caption;
    setLocalSelectedRecipesCaption(JSON.parse(JSON.stringify(localSelectedRecipesCaption)));
  };

  const onClickDone = () => {
    console.log('Done Adding Captions');
    // copy caption to selectedRecipes
    localSelectedRecipes.forEach(r => r.caption = localSelectedRecipesCaption[r.id]);
    setSelectedRecipes([...localSelectedRecipes]);
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesCaption({});
    onDone();
  };

  const onClickBack = () => {
    console.log('Back');
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesCaption({});
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
                recipesCaption={localSelectedRecipesCaption}
                updateCaption={updateLocalSelectedRecipesCaption} 
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