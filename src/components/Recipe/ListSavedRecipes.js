import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import Recipe from './SavedRecipe';
import Paginate from '../Paginate';
import RecipePlaceholder from './RecipePlaceholder';

const ListSavedRecipes = () => {
  const { recipes, isFetchingRecipes, isInitialLoad, activeCardId, selectRecipe } = useOutletContext();
  return (
    <>
      <Container className='justify-content-sm-center justify-content-md-center'>
        <h2>List of Saved Recipes</h2>
        <br/>
        {recipes.length > 0 && (<>
          {/* <Paginate totalCount={recipes.length} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} /> */}
          <br />
        </>)}
        <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} className='gy-4'>
          {isFetchingRecipes && isInitialLoad && (<>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
            <Col md={5}><RecipePlaceholder /></Col>
          </>)}
          {recipes.map((recipe, recipeIndex) => (
            <Col md={5} key={recipe.id}>
              <Recipe activeCardId={activeCardId} recipe={recipe} recipeIndex={recipeIndex} onSelect={selectRecipe} />
            </Col>
          ))}
        </Row>
        {recipes.length > 0 && (<>
          <br /><br />
          {/* <Paginate totalCount={recipeCount} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} /> */}
        </>)}
      </Container>
    </>
  );
};

export default ListSavedRecipes;