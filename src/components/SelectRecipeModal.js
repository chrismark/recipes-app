import { useState, useEffect } from 'react';
import { Container, Form, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft } from 'react-icons/fa';

const SelectRecipeModal = ({ show, onSelect, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

  }, []);

  return (
    <Modal show={show} size='md' backdrop={false} centered>
      <Modal.Header>
        <Modal.Body className='m-0 p-0'>
          <Row className=''>
            <Col md={1}>
              <div className='text-center' onClick={onClose}>
                <span className='h5 cursor-pointer'><FaLongArrowAltLeft className='fs-3' /></span>
              </div>
            </Col>
            <Col md={10} className='text-center'>
              <h5 className='m-0'>Select A Recipe</h5>
            </Col>
          </Row>  
        </Modal.Body>
      </Modal.Header>
      <Modal.Body>
        <Row className=''>
          <Col className='d-grid' md={{span: 3, offset: 9}} style={{textAlign: 'right'}}>
            <Button 
              variant='primary' 
              type='submit' 
              disabled={isLoading}
              size='md'
              onClick={onSelect}
              >Select</Button>
          </Col>
        </Row>  
        
      </Modal.Body>
    </Modal>
  );
};

export default SelectRecipeModal;