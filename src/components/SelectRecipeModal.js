import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft, FaCheckCircle } from 'react-icons/fa';

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

const CardImgPlaceholder = () => {
  return (
    <Card style={{overflow: 'hidden', position: 'relative'}}>
      <span className='placeholder-glow'>
        <img className='placeholder card-img card-img-top' src={'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9ImN1cnJlbnRDb2xvciIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIvPjwvc3ZnPg'}  />
      </span>
    </Card>
  );
};

const CardSelectableRecipe = ({recipe, onToggleClick, isSelected}) => {
  return (
    <Card
      className='text-body text-decoration-none cursor-pointer' 
      style={{overflow: 'hidden', position: 'relative'}}
      onClick={onToggleClick}
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} style={{
        width: (recipe.aspect_ratio === '16:9' ? '177.5%' : '')
      }} />
      {isSelected && (
      <>
        <Card.Body style={{position: 'absolute', width: '100%', height: '100%'}} className=''>
          <FaCheckCircle fontSize='2em' color='#01c92c' fill='#01c92c' />
        </Card.Body>
      </>
      )}
    </Card>
  );
};

const SelectRecipeModal = ({ user, show, onSelect, onClose, selectedRecipes, setSelectedRecipes }) => {
  console.log('SelectRecipeModal::rendering show=', show);
  const navigate = useNavigate();
  const isShown = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [localSelectedRecipes, setLocalSelectedRecipes] = useState([]);
  const [localSelectedRecipesMap, setLocalSelectedRecipesMap] = useState({});
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [page, setPage] = useState(1);
  isShown.current = show;

  useEffect(() => {
    console.log('SelectRecipeModal::mounted');
    return () => console.og('SelectRecipeModal::unmounted');
  }, []);

  useEffect(() => {
    if (show) {
      getRecipes();
    }
  }, [show, page]);

  const getRecipes = async () => {
    if (isFetchingRecipes) { return; }
    setIsFetchingRecipes(true);
    const [data, status] = await fetchRecipes(user.uuid, user.token, page);
    console.log('getRecipes:: isMounted=' + isShown.current + ', show=' + show);
    if (!isShown.current) {
      setIsFetchingRecipes(false);
      return; 
    }
    if (status !== 200) {
      setIsFetchingRecipes(false);
      setRecipes([]);
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setRecipes(data);
    updateLocalSelectedRecipesData(selectedRecipes, data);
    setIsFetchingRecipes(false);
    console.log('data: ', data);
  }

  const updateLocalSelectedRecipesData = (selectedRecipes, data) => {
    // update `data` so that recipes that are inside selectedRecipes have a property selected set to true
    for (let i = 0; i < selectedRecipes.length; i++) {
      let r = data.find(r => r.id == selectedRecipes[i].id);
      console.log('r: ', r);
      if (r) {
        localSelectedRecipes.push(r);
        localSelectedRecipesMap[r.id] = true;
      }
    }
    setLocalSelectedRecipesMap(localSelectedRecipesMap);
    setLocalSelectedRecipes(localSelectedRecipes);
  };

  const onClickRecipe = (recipe) => {
    console.log('selected: ', recipe);
    console.log('selectedRecipes: ', selectedRecipes);
    if (!localSelectedRecipesMap[recipe.id]) {
      let {id, thumbnail_url, aspect_ratio} = recipe;
      localSelectedRecipes.push({id, thumbnail_url, aspect_ratio});
      setLocalSelectedRecipes(localSelectedRecipes);
      // set selected map
      localSelectedRecipesMap[recipe.id] = true;
      setLocalSelectedRecipesMap(localSelectedRecipesMap);
    }
    else { // uncheck recipe
      // search for index so we can remove it form localSelectedRecipes
      let idx = localSelectedRecipes.findIndex(r => r.id == recipe.id);
      // extract recipes excluding the unchecked one
      let leftRecipes = localSelectedRecipes.slice(0, idx);
      let rightRecipes = localSelectedRecipes.slice(idx + 1);
      setLocalSelectedRecipes([...leftRecipes, ...rightRecipes]);
      // set selected map
      localSelectedRecipesMap[recipe.id] = null;
      delete localSelectedRecipesMap[recipe.id];
      setLocalSelectedRecipesMap(localSelectedRecipesMap);
    }
    setRecipes([...recipes]);
  };

  const onSelectRecipe = () => {
    setSelectedRecipes(localSelectedRecipes);
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesMap({});
    isShown.current = false;
    onSelect();
  };

  const onClickBack = () => {
    console.log('onClickBack');
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesMap({});
    isShown.current = false;
    onClose();
  };

  return (
    <Modal show={show} size='lg' backdrop={false} scrollable>
      <Modal.Header>
        <Modal.Body className='m-0 p-0' style={{overflow: 'hidden'}}>
          <Row className=''>
            <Col md={1}>
              <div className='text-center' onClick={onClickBack}>
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
          {isFetchingRecipes && (
            <>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
            </>
          )}
          {!isFetchingRecipes && recipes && recipes.length > 0 && recipes.map((recipe, idx) => (
            <Col key={recipe.id}>
              <CardSelectableRecipe
                recipe={recipe}
                onToggleClick={() => onClickRecipe(recipe)}
                isSelected={recipe && localSelectedRecipesMap[recipe.id]}
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
              disabled={isFetchingRecipes}
              size='md'
              onClick={onSelectRecipe}
              >Select {localSelectedRecipes.length} Recipe{localSelectedRecipes.length > 1 || localSelectedRecipes.length == 0 ? 's' : ''}</Button>
          </Col>
        </Row>  
      </Modal.Footer>
    </Modal>
  );
};

export default SelectRecipeModal;