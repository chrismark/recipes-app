import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Collapse, Modal } from 'react-bootstrap';
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
import { useStore } from '../Toaster';
import { HeaderMinimal } from '../Header';

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

const ViewSavedRecipe = ({ user }) => {
  const { toast } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe: localRecipe } = location.state;
  const [recipe, setRecipe] = useState(localRecipe);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [disableRating, setDisableRating] = useState(false);
  const recipeEtc = useRef(null);
  
  useEffect(async () => {
    console.log('ViewSavedRecipe useEffect() run');
    await getRecipe();
    if (recipeEtc.current != null) {
      recipeEtc.current.style.display = 'block';
      recipeEtc.current.style.opacity = 1;
    }
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

  const handleClick = async (rating) => {
    console.log('rating: ', rating);
    setDisableRating(true);
    setRecipe(recipe => ({...recipe, rating}));
    const [data, error] = await submitRating(user.token, recipe.id, recipe.rating_id, rating);
    setRecipe(recipe => ({...recipe, rating_id: data.id}));
    setDisableRating(false);
    toast('Rating updated');
  }

  const onClose = (e) => {
    e.preventDefault();
    navigate(-1); // Back to Posts
  };

  return (<>
  <Modal show={true} fullscreen={true}>
    <Modal.Body>
      {/* <HeaderMinimal user={user} id='postfullscreen-header' className='postfullscreen-header' onClose={onClose} /> */}

    <Container className='justify-content-sm-center justify-content-md-center' style={{zIndex: 2, height: '100vh'}}>
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
      <Row ref={recipeEtc} className='recipe-etc' style={{display: 'none', opacity: 0}}>
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
              {!open && (<span onClick={() => setOpen(true)}><span className='fs-6 d-block'>Show More</span><IoIosArrowDropdown /></span>)}
              {open && (<span onClick={() => setOpen(false)}><span className='fs-6 d-block'>Show Less</span><IoIosArrowDropup /></span>)}
            </span>
          </div>
          <RecipeComments recipe={recipe} user={user} />
        </Col>     
      </Row>
    </Container>

    </Modal.Body>
  </Modal>
  </>);
};

export default ViewSavedRecipe;