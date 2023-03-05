import { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltRight } from 'react-icons/fa';
import PostRecipesPreview from './PostRecipesPreview';

const CreateEditPostModal = ({ isSubmitting, show, postId, postMessage, setPostMessage, selectedRecipes, setSelectedRecipes, clearSelectedRecipes, onCreateSubmit, onUpdateSubmit, onClose, onAddARecipe, onEditCaption }) => {
  const onMessageChange = (e) => {
    setPostMessage(e.target.value);
  };

  const noOp = () => {};

  return (
    <Modal show={show} onHide={onClose} xs={12} backdrop='static'>
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
              disabled={isSubmitting}
              />
          </Form.Group>
          <PostRecipesPreview 
            recipes={selectedRecipes} 
            onClearRecipes={clearSelectedRecipes} 
            onEditCaption={onEditCaption}
            isFilterDeleted={postId != null}
            disableEditButton={isSubmitting}
            />
          <div role='button' className='mt-3 text-center' onClick={isSubmitting ? noOp : onAddARecipe}>
            <span className={'h5 cursor-pointer' + (isSubmitting ? ' text-muted' : '')}>Add A Recipe <FaLongArrowAltRight className='fs-3' /></span>
          </div>
          <div className='d-grid mt-3'>
            <Button 
              disabled={isSubmitting}
              variant={isSubmitting ? 'secondary' : 'primary'}
              type='submit' 
              onClick={postId == null ? onCreateSubmit : onUpdateSubmit}
              size='md'>{isSubmitting ? 'Submitting...' : (postId == null ? 'Post' : 'Update')}</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

CreateEditPostModal.defaultProps = {
  isSubmitting: false,
};

export default CreateEditPostModal;