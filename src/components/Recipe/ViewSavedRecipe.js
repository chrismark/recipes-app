import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import MainContainer from '../MainContainer';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import RecipeNutrition from './RecipeNutrition';
import RecipePreparation from './RecipePreparation';
import RecipeImage from './RecipeImage';

const ViewSavedRecipe = ({ user }) => {
  const location = useLocation();
  const { recipe } = location.state;

  return (<>
    <MainContainer user={user}>
      <Container className='justify-content-sm-center justify-content-md-center'>
        <h2>{recipe.name}</h2>
        <br/>
        <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
          <Col md='auto text-center'>
            <RecipeImage src={recipe.thumbnail_url} />
          </Col>
        </Row>
        <Row>
          <Col>
            <br/>
            <RecipeDescription recipe={recipe} />
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
          </Col>     
        </Row>
      </Container>
    </MainContainer>
  </>);
};

export default ViewSavedRecipe;