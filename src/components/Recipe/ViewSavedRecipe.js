import { useEffect, useState } from 'react';
import { Container, Row, Col, Collapse, Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import RecipeTimeInMinutes from './RecipeTimeInMinutes';
import RecipeCredits from './RecipeCredits';
import RecipeDescription from './RecipeDescription';
import RecipeIngredients from './RecipeIngredients';
import RecipeNutrition from './RecipeNutrition';
import RecipePreparation from './RecipePreparation';
import RecipeImage from './RecipeImage';
import StarRating from './StarRating';
import RecipeComments from './RecipeComments';

const ViewSavedRecipe = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe: localRecipe } = location.state;
  const [recipe, setRecipe] = useState(localRecipe);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [disableRating, setDisableRating] = useState(false);

  useEffect(() => {
    console.log('ViewSavedRecipe useEffect() run');
    window.scrollTo(0, 0);
    getRecipe();

    return () => console.log('ViewSavedRecipe unmount');
  }, []); //

  const getRecipe = async () => {
    setLoading(true);
    setDisableRating(true);
    const [data, status] = await fetchRecipe(user.token, user.uuid, recipe.id);
    if (status !== 200) {
      
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setLoading(false);
    let {id, ...others} = recipe;
    let {id: newDataId, ...otherData} = data[0];
    setRecipe(recipe => ({...others, id, ...otherData}));
    setDisableRating(false);
  }

  const fetchRecipe = async (token, user_uuid, recipe_id) => {
    const url = `/api/users/${user_uuid}/recipes/${recipe_id}`;
    console.log('fetchRecipes url: ', url);
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await result.json();
    return [data, result.status];
  };

  const handleClick = async (rating) => {
    console.log('rating: ', rating);
    setDisableRating(true);
    setRecipe(recipe => ({...recipe, rating}));
    const [data, error] = await submitRating(user.token, recipe.id, recipe.rating_id, rating);
    setRecipe(recipe => ({...recipe, rating_id: data.id}));
    setDisableRating(false);
  }

  const submitRating = async (token, recipe_id, rating_id, rating) => {
    try {
      const url = `/api/recipes/${recipe_id}/ratings` + (rating_id != null ? `/${rating_id}` : '');
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({rating})
      });
      const data = await result.json();
      if (data.errorMessage) {
        return [null, data.errorMessage];
      }
      return [data, null];
    }
    catch (e) {
      console.error(e);
      return [null, null];
    }
  };

  return (<>
    <Container className='justify-content-sm-center justify-content-md-center'>
      <h5><Link to='/saved-recipes' style={{textDecoration: 'none'}} onClick={(e) => { e.stopPropagation(); navigate(-1); }}>Back</Link></h5>
      <br/>
      <h2 className='mb-0'>{recipe.name}</h2>
      <StarRating disabled={disableRating} rating={(recipe && recipe.rating)} onClick={handleClick} />
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
            <span className='h1 cursor-pointer'>
              {!open && (<IoIosArrowDropdown onClick={() => setOpen(true)} />)}
              {open && (<IoIosArrowDropup onClick={() => setOpen(false)} />)}
            </span>
          </div>
          <RecipeComments recipe={recipe} user={user} />
        </Col>     
      </Row>
    </Container>
  </>);
};

export default ViewSavedRecipe;