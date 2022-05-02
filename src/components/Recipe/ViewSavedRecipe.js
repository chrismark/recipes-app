import { useEffect, useState } from 'react';
import { Container, Row, Col, Collapse, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import RecipeNutrition from './RecipeNutrition';
import RecipePreparation from './RecipePreparation';
import RecipeImage from './RecipeImage';

const ViewSavedRecipe = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe } = location.state;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (<>
    <Container className='justify-content-sm-center justify-content-md-center'>
      <h5><Link to='/saved-recipes' style={{textDecoration: 'none'}} onClick={(e) => { e.stopPropagation(); navigate(-1); }}>Back</Link></h5>
      <br/>
      <h2>{recipe.name}</h2>
      <br/>
      <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
        <Col md='auto text-center'>
          <RecipeImage src={recipe.thumbnail_url} maxHeight='60vh' />
        </Col>
      </Row>
      <Row>
        <Col>
          <br/>
          <RecipeDescription recipe={recipe} />
          <RecipeCredits recipe={recipe} />
          <RecipeTimeInMinutes recipe={recipe} />
          <Collapse in={open}>
            <Row lg={2} xs={1}>
              <Col className='mt-4'>
                <RecipeIngredients recipe={recipe} />
                <RecipeNutrition recipe={recipe} />
              </Col>
              <Col className='mt-4'>
                <RecipePreparation recipe={recipe} />
              </Col>
            </Row>
          </Collapse>
          <div className='text-center'>
            <br/>
            <Button variant='light' onClick={() => setOpen(!open)}>Show {(open ? 'Less' : 'More')}</Button>
          </div>
        </Col>     
      </Row>
    </Container>
  </>);
};

export default ViewSavedRecipe;