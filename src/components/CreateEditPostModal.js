import { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltRight } from 'react-icons/fa';
import PostRecipesPreview from './PostRecipesPreview';

// TODO: Why not create a Post object that contains:
// - id,
// - message
// - recipes
// - updateMessage
// - updateRecipes
// - clearRecipes
const CreateEditPostModal = ({ show, postId, postMessage, setPostMessage, selectedRecipes, setSelectedRecipes, clearSelectedRecipes, onSubmit, onClose, onAddARecipe, onEditCaption }) => {
  const onMessageChange = (e) => {
    setPostMessage(e.target.value);
  };

  return (
    <Modal show={show} onHide={onClose} size='md' xs={12} backdrop='static'>
      <Modal.Header closeButton>
        <Modal.Title><h5 className='m-0'>{postId == null ? 'Create' : 'Edit'} A Post</h5></Modal.Title>
      </Modal.Header>
      <Modal.Body>      
        <Form>
          <Form.Group controlId='createNewPost0'>
            <Form.Control
              as='textarea'
              placeholder={"What do you want to post?"}
              rows={4}
              onBlur={onMessageChange}
              defaultValue={postMessage}
              />
          </Form.Group>
          <PostRecipesPreview 
            recipes={selectedRecipes} 
            setRecipes={setSelectedRecipes}
            onClearRecipes={clearSelectedRecipes} 
            onEditCaption={onEditCaption}
            />
          <div className='mt-3 text-center' onClick={onAddARecipe}>
            <span className='h5 cursor-pointer'>Add A Recipe <FaLongArrowAltRight className='fs-3' /></span>
          </div>
          <div className='d-grid mt-3'>
            <Button 
              variant='primary' 
              type='submit' 
              onClick={onSubmit}
              size='md'>{postId == null ? 'Post' : 'Update'}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateEditPostModal;