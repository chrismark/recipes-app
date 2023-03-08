import { useState } from 'react';
import { Container, Row, Col, Collapse, Modal } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IoIosArrowDropdown, IoIosArrowDropup } from 'react-icons/io';
import { useQueryClient, useMutation } from 'react-query';
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
import { useRecipe, submitRating } from '../recipeStore';

const ViewSavedRecipe = ({ user }) => {
  const { toast } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { recipe: localRecipe } = location.state;
  const [open, setOpen] = useState(true);
  const queryClient = useQueryClient();
  const { data: recipe, error, isFetching } = useRecipe(user?.uuid, user?.token, localRecipe.id, localRecipe);

  console.log('ViewSavedRecipe:: recipe=', recipe);

  const updateRecipeRatingMutation = useMutation(
    submitRating,
    {
      onMutate: async (variables) => {
        console.log('updateRecipeRatingMutation: onMutate variables=', variables);
        await queryClient.cancelQueries(['recipe', user?.uuid, user?.token, variables.recipe_id]);
        const previousValue = queryClient.getQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id]);
        console.log('updateRecipeRatingMutation: onMutate previousValue=', previousValue);
        // optimistic update
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], {...previousValue, rating: variables.rating });
        return previousValue;
      },
      onSuccess: function (data, variables, previousValue) {
        console.log('updateRecipeRatingMutation: onSuccess data=', data, 'variables=', variables, 'previousValue=', previousValue);
        if (data.errorMessage) {
          return;
        }
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], {...previousValue, ...data});
      },
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], previousValue);
        // toast('Something happened while updating the post. Please try again later.');
      }
    }
  );

  const handleClick = async (rating) => {
    console.log('rating=', rating);
    console.log('recipe.id=', recipe.id);
    await updateRecipeRatingMutation.mutateAsync({ 
      token: user.token, recipe_id: recipe.id, rating_id: recipe.rating_id, rating 
    });
  };

  return (
  <Modal show={true} fullscreen={true}>
    <Modal.Body>
      <Container className='justify-content-sm-center justify-content-md-center' style={{zIndex: 2, height: '100vh'}}>
        <h5><Link to='/saved-recipes' style={{textDecoration: 'none'}} onClick={(e) => { e.stopPropagation(); navigate(-1); }}>Back</Link></h5>
        <br/>
        <h2 className='mb-0'>{recipe?.name}</h2>
        <StarRating disabled={isFetching || updateRecipeRatingMutation.isLoading} rating={recipe?.rating} onClick={handleClick} />
        <br/>
        <Row className='justify-content-md-center' style={{background: 'black', marginBottom: '0em', marginLeft: '0em', marginRight: '0em', marginTop: '0em'}}>
          <Col md='auto text-center'>
            <RecipeImage src={recipe?.thumbnail_url} maxHeight='60vh' />
          </Col>
        </Row>
        {!isFetching && <Row className='recipe-etc'>
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
        </Row>}
      </Container>
    </Modal.Body>
  </Modal>
  );
};

export default ViewSavedRecipe;