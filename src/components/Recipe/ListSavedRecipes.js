import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import Recipe from './SavedRecipe';
import Paginate from '../Paginate';
import RecipePlaceholder from './RecipePlaceholder';

const ListSavedRecipes = ({ recipes, isFetchingRecipes, isInitialLoad, activeCardId, selectRecipe }) => {
  // console.log('ListSavedRecipes:', recipes);
  // const { recipes, isFetchingRecipes, isInitialLoad, activeCardId, selectRecipe } = useOutletContext();
  return (
    <Container className='saved-recipes justify-content-sm-center justify-content-md-center'>
      <h2>List of Saved Recipes</h2>
      <br/>
      {/* {!isFetchingRecipes && recipes.length > 0 && (<>
        <Paginate totalCount={recipes.length} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} />
        <br />
      </>)} */}
      <Row xs={1} sm={2} md={3} lg={3} xl={4} xxl={4} className='gy-4'>
        {isFetchingRecipes && isInitialLoad && (<>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
          <Col sm={6}><RecipePlaceholder showLinkSection={false} /></Col>
        </>)}
        {!isFetchingRecipes && recipes && recipes.map((recipe, recipeIndex) => (
          <Col sm={6} key={recipe.id}>
            <Recipe activeCardId={activeCardId} recipe={recipe} recipeIndex={recipeIndex} onSelect={selectRecipe} />
          </Col>
        ))}
      </Row>
      {/* {!isFetchingRecipes && recipes.length > 0 && (<>
        <br /><br />
        <Paginate totalCount={recipeCount} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} />
      </>)} */}
    </Container>
  );
};

export default ListSavedRecipes;