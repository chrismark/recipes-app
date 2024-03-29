import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Modal, Row, Col } from 'react-bootstrap';
import { FaLongArrowAltLeft, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useRecipes } from './recipeStore';

const CardImgPlaceholder = () => {
  return (
    <Card style={{overflow: 'hidden', position: 'relative'}}>
      <span className='placeholder-glow'>
        <img className='placeholder card-img card-img-top' src={'data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTA4MCAxMDgwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IGZpbGw9ImN1cnJlbnRDb2xvciIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIvPjwvc3ZnPg'}  />
      </span>
    </Card>
  );
};

const CardSelectableRecipe = ({recipe, onToggleClick, selectionMap}) => {
  return (
    <Card
      className='selectable-recipe text-body text-decoration-none cursor-pointer' 
      style={{overflow: 'hidden', position: 'relative'}}
      onClick={onToggleClick}
      tooltip='test'
    >
      <Card.Img variant='top' src={recipe.thumbnail_url} />
      {selectionMap.hasOwnProperty(recipe.id) && (
      <>
        <Card.Body style={{position: 'absolute', width: '100%', height: '100%'}} className=''>
          {!selectionMap[recipe.id] ? (
            <FaTimesCircle fontSize='2em' color='#e52e49' fill='#e52e49' />
          ) : (
            <FaCheckCircle fontSize='2em' color='#01c92c' fill='#01c92c' />
          )}
          
        </Card.Body>
      </>
      )}
    </Card>
  );
};

const ActualSelectRecipeModal = ({ user, show, postId, onSelect, onClose, selectedRecipes, setSelectedRecipes }) => {
  console.log('SelectRecipeModal::rendering show=', show);
  const [page, setPage] = useState(1);
  const { data: recipes, error, isFetching } = useRecipes(user?.uuid, user?.token, page, 'minimal');
  const [localSelectedRecipes, setLocalSelectedRecipes] = useState([]);
  const [localSelectedRecipesMap, setLocalSelectedRecipesMap] = useState({});

  useEffect(() => {
    console.log('SelectRecipeModal::mounted');
    return () => console.log('SelectRecipeModal::unmounted');
  }, []);

  useEffect(() => {
    console.log('show or recipes changed.');
    console.log('error: ', error);
    if (show) {
      updateLocalSelectedRecipes();
    }
  }, [show, recipes, error]);

  const updateLocalSelectedRecipes = () => {
    setLocalSelectedRecipes([...selectedRecipes]);
    selectedRecipes.map(r => { 
      // initialize selection map using 'deleted' prop
      localSelectedRecipesMap[r.id] = r.deleted ? false : true; 
    });
    setLocalSelectedRecipesMap(JSON.parse(JSON.stringify(localSelectedRecipesMap)));
  };

  const onClickRecipe = (recipe) => {
    if (!recipe) {
      console.log('passed recipe is null or undefined');
      return;
    }
    if (!localSelectedRecipesMap[recipe.id]) { // check recipe
      localSelectedRecipesMap[recipe.id] = true;
      let index = localSelectedRecipes.findIndex(r => r.id == recipe.id);
      // if Editing and recipe is already associated with edited post
      if (postId != null && localSelectedRecipes[index] != null && localSelectedRecipes[index].post_id != null) {
        localSelectedRecipes[index].deleted = undefined;
        delete localSelectedRecipes[index]['deleted'];
        console.log('Removing ' + recipe.name + ' from localDeleteMap.');
      }
      else { // add to selected list
        localSelectedRecipes.push(JSON.parse(JSON.stringify(recipe)));
      }
      setLocalSelectedRecipes([...localSelectedRecipes]);
      setLocalSelectedRecipesMap(JSON.parse(JSON.stringify(localSelectedRecipesMap)));
    }
    else { // uncheck recipe
      delete localSelectedRecipesMap[recipe.id];
      let index = localSelectedRecipes.findIndex(r => r.id == recipe.id);
      // if Editing and recipe is already associated with edited post
      if (postId != null && localSelectedRecipes[index] != null && localSelectedRecipes[index].post_id != null) {
        // mark for deletion
        localSelectedRecipes[index].deleted = true;
        console.log('Adding ' + recipe.name + ' to localDeleteMap.');
        localSelectedRecipesMap[recipe.id] = false;
        setLocalSelectedRecipes([...localSelectedRecipes]);
      }
      else {// remove from selected list
        let leftRecipes = localSelectedRecipes.slice(0, index);
        let rightRecipes = localSelectedRecipes.slice(index + 1);
        setLocalSelectedRecipes([...leftRecipes, ...rightRecipes]);
      }      
      setLocalSelectedRecipesMap(JSON.parse(JSON.stringify(localSelectedRecipesMap)));
    }
  };

  const onClickSelectRecipes = () => {
    console.log('Select Recipes');
    setSelectedRecipes([...localSelectedRecipes]);
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesMap({});
    onSelect();
  };

  const onClickBack = () => {
    console.log('Back');
    setLocalSelectedRecipes([]);
    setLocalSelectedRecipesMap({});
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
        <Row xs={4} className='gy-4'>
          {isFetching && (
            <>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
              <Col><CardImgPlaceholder /></Col>
            </>
          )}
          {!isFetching && recipes && recipes.length > 0 && recipes.map((recipe, idx) => (
            <Col key={recipe.id} className='d-flex'>
              <CardSelectableRecipe
                recipe={recipe}
                onToggleClick={() => onClickRecipe(recipe)}
                selectionMap={localSelectedRecipesMap}
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
              disabled={isFetching}
              size='md'
              onClick={onClickSelectRecipes}
              >Select Recipe</Button>
          </Col>
        </Row>  
      </Modal.Footer>
    </Modal>
  );
};

const SelectRecipeModal = (props) => {
  return props.show ? <ActualSelectRecipeModal {...props} /> : <></>;
};

export default SelectRecipeModal;