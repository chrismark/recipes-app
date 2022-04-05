import { useState } from 'react';
import { Figure, Modal, Row, Col, Carousel } from 'react-bootstrap';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import RecipeNutrition from './RecipeNutrition';
import RecipePreparation from './RecipePreparation';
import RecipeImage from './RecipeImage';

const QuickViewCompilationModal = ({ compilation, show, onClose }) => {
  const [recipe, setRecipe] = useState(null);

  const onSelectRecipe = (index) => {
    console.log('Selected ' + index)
    index -= 1;
    if (index >= 0) {
      setRecipe(compilation.recipes[index]);
    }
    else {
      setRecipe(null);
    }
  };

  return (
    <Modal show={show} onHide={onClose} size='xl' xs={2} centered>
      <Modal.Header closeButton>
        <Modal.Title><h2>Compilation: {compilation.name}</h2></Modal.Title>
      </Modal.Header>
      <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
        <Col md='auto text-center'>
          <Carousel interval={null} onSelect={onSelectRecipe} fade={true} slide={false}>
            <Carousel.Item>
              <RecipeImage src={compilation.thumbnail_url} />
            </Carousel.Item>
            {compilation.recipes.map(recipe => (
              <Carousel.Item key={recipe.id}>
                <RecipeImage src={recipe.thumbnail_url} />
                <Carousel.Caption><h3 className='bg-dark pb-1'>{recipe.name}</h3></Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
      <Modal.Body>
        <RecipeDescription recipe={(recipe !== null ? recipe : compilation)} />
        {recipe !== null && (
          <>
            <RecipeCredits recipe={recipe} />
            <RecipeTimeInMinutes recipe={recipe} />
            <Row lg={2} xs={1}>
              <Col className='mt-4'>
                <RecipeIngredients recipe={recipe} />
                <RecipeNutrition recipe={recipe} />
              </Col>
              <Col className='mt-4'>
                <RecipePreparation recipe={recipe} />
              </Col>
            </Row>
          </>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default QuickViewCompilationModal;