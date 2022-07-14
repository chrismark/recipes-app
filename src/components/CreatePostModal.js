import { useState } from 'react';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';

const CreatePostModal = ({ show, onSubmit, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Modal show={show} onHide={onClose} size='md' xs={12} centered>
      <Modal.Header closeButton>
        <Modal.Title><h5>Create A Post</h5></Modal.Title>
      </Modal.Header>
      <Modal.Body>      
        <Form>
          <Form.Group controlId='createNewPost0'>
            <Form.Control
              as='textarea'
              placeholder={"What do you want to post?"}
              rows={5}
              />
          </Form.Group>
          <div className='mt-3'>
            TODO: Add recipes to your post.
          </div>
          <Row>
            <Col>
            </Col>
          </Row>
          <div className='d-grid mt-3'>
            <Button 
              variant='primary' 
              type='submit' 
              disabled={isLoading}
              size='md'>Post</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreatePostModal;