import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { Card, Fade } from 'react-bootstrap';

const SelectRecipeModal = ({ user, show, onSelect, onClose, selectedRecipes, setSelectedRecipes }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getRecipes();
  }, [page]);

  const getRecipes = async () => {
    if (isFetchingRecipes) { return; }
    setIsFetchingRecipes(true);
    const [data, status] = await fetchRecipes(user.uuid, user.token, page);
    if (status !== 200) {
      setIsFetchingRecipes(false);
      setRecipes([]);
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setIsFetchingRecipes(false);
    setRecipes(data);
    console.log('data: ', data);
  }

  const fetchRecipes = async (uuid, token, page) => {
    const url = `/api/users/${uuid}/recipes?page=${page}`;
    console.log('fetchRecipes url: ', url);
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('result: ', result);
    const data = await result.json();
    return [data, result.status];
  };

  return (
    <Modal show={show} size='lg' backdrop={false} scrollable>
      <Modal.Header>
        <Modal.Body className='m-0 p-0' style={{overflow: 'hidden'}}>
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
        <Row xs={3} className='gy-4'>
          {recipes && recipes.length > 0 && recipes.map(recipe => (
            <Col key={recipe.id}>
              <Card
                className='text-body text-decoration-none cursor-pointer' 
                style={{overflow: 'hidden', position: 'relative'}}
              >
                <Card.Img variant='top' src={recipe.thumbnail_url} style={{
                  width: (recipe.aspect_ratio === '16:9' ? '177.5%' : '')
                }} />
              </Card>
            </Col>
          ))}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Row>
          <Col className='d-grid p-0' md='auto' style={{textAlign: 'right'}}>
            <Button 
              variant='primary' 
              type='submit' 
              disabled={isLoading}
              size='md'
              onClick={onSelect}
              >Select Recipe(s)</Button>
          </Col>
        </Row>  
      </Modal.Footer>
    </Modal>
  );
};

export default SelectRecipeModal;