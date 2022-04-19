import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import MainContainer from './MainContainer';
import Paginate from './Paginate';
import Recipe from './Recipe/SavedRecipe';
import RecipePlaceholder from './Recipe/RecipePlaceholder';

const SavedRecipes = ({ user }) => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(-1);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [pageOffset, setPageOffset] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (user) {
      getRecipes();
    }
  }, [page]);

  const getRecipes = async () => {
    if (isFetchingRecipes) { return; }
    setIsFetchingRecipes(true);
    const [data, status] = await fetchRecipes(user.token);
    if (status !== 200) {
      setIsFetchingRecipes(false);
      setRecipes([]);
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setIsInitialLoad(false);
    setIsFetchingRecipes(false);
    setRecipeCount(data.length);
    setRecipes(data);
  }

  const fetchRecipes = async (token) => {
    const url = '/api/recipes?page=' + page;
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

  return (
    <MainContainer user={user}>
      {isFetchingRecipes && (
      <Container fluid='sd' className='centered-loading-animation-container'>
        <Row lg={1} className='centered-loading-animation-row justify-content-md-center'>
          <Col className='centered-loading-animation-col'><Spinner animation="grow " /></Col>
        </Row>
      </Container>
      )}
      <Container className='justify-content-sm-center justify-content-md-center'>
        <h2>Saved Recipes</h2>
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
              <Recipe activeCardId={activeCardId} recipe={recipe} recipeIndex={recipeIndex} />
            </Col>
          ))}
        </Row>
        {recipes.length > 0 && (<>
          <br /><br />
          {/* <Paginate totalCount={recipeCount} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} /> */}
        </>)}
      </Container>
    </MainContainer>
  );
};

export default SavedRecipes;