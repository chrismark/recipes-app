import { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import RecipeCompilation from './RecipeCompilation';
import RecipeShort from './RecipeShort';
import QuickViewModal from './QuickViewModal';
import QuickViewCompilationModal from './QuickViewCompilationModal';
import Paginate from './Paginate';
import MainContainer from './MainContainer';
import RecipePlaceholder from './RecipePlaceholder';
import SaveRecipeModal from './SaveRecipeModal';

const TastyRecipes = ({ user }) => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(-1);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [quickViewRecipe, setQuickViewRecipe] = useState(null);
  const [isRecipeModalShown, setIsRecipeModalShown] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [isSavingRecipe, setIsSavingRecipe] = useState(false);
  const [isSaveRecipeModalShown, setIsSaveRecipeModalShown] = useState(false);
  const [recipesToSave, setRecipesToSave] = useState([]);
  const [recipesSaved, setRecipesSaved] = useState([]);
  const size = 20;
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;
  const NewDaysMs = 2 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (user) {
      getRecipes();
    }
  }, [pageOffset]);

  const isRecipeNew = ({ approved_at }) => {
    let recipeApprovedDate = new Date(approved_at * 1000);
    let diff = Date.now() - recipeApprovedDate;
    return diff < NewDaysMs;
  };

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    setPageOffset((page - 1) * size);
  };

  const getRecipes = async () => {
    if (isFetchingRecipes) { return; }
    setIsFetchingRecipes(true);
    const [data, status] = await fetchRecipes(user.token);
    if (status !== 200) {
      setIsFetchingRecipes(false);
      setRecipeCount(0);
      setRecipes([]);
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setIsInitialLoad(false);
    setIsFetchingRecipes(false);
    setRecipeCount(data.count);
    setRecipes(data.results);
  }

  const fetchRecipes = async (token) => {
    const url = '/api/tasty?offset=' + pageOffset +'&size=' + size;
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

  const doQuickViewSidebar = (index) => {
    let recipe = recipes[index];
    if (recipe.description) {
      recipe.description = replaceLinksWithText(recipe.description);
    }
    setQuickViewRecipe(recipe);
    setIsRecipeModalShown(index >= 0);
    setActiveCardId(recipe.id);
  };

  const closeQuickViewModal = () => {
    setActiveCardId(-1);
    setIsRecipeModalShown(false);
    setQuickViewRecipe(null);
  };

  const saveRecipe = async (token, recipes) => {
    const url = '/api/recipes';
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(recipes)
    });
    console.log('result: ', result);
    const data = await result.json();
    return [data, result.status];
  };

  const doSave = async (recipes) => {
    if (!Array.isArray(recipes)) {
      recipes = [recipes];
    }
    if (isSavingRecipe) { 
      return; 
    }
    setRecipesToSave(recipes);
    setRecipesSaved([]);
    setIsSaveRecipeModalShown(true);
    setIsSavingRecipe(true);
    const [data, status] = await saveRecipe(user.token, recipes);
    setIsSavingRecipe(false);
    if (data.errorMessage) {
      return console.log('Error saving recipe: ', data.errorMessage);
    }
    else {
      setRecipesToSave([]);
      setRecipesSaved(data);
    }
    console.log('data: ', data);
  };

  const onSaveClose = () => {
    setRecipesSaved([]);
    setRecipesToSave([]);
    setIsSavingRecipe(false);
    setIsSaveRecipeModalShown(false);    
  };

  const replaceLinksWithText = (text) => {
    let result = null;
    let copyText = text;
    while (result = regexLink.exec(text)) {
      copyText = copyText.replace(result[0], result[2]);
    }
    return copyText;
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
        <h2>Latest from Tasty.co</h2>
        <br/>
        {recipes.length > 0 && (<>
          <Paginate totalCount={recipeCount} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} />
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
              {recipe.recipes && recipe.recipes.length 
                ? (<RecipeCompilation activeCardId={activeCardId} isNew={isRecipeNew(recipe)} compilation={recipe} compilationIndex={recipeIndex} onView={doQuickViewSidebar} />)
                : (<RecipeShort activeCardId={activeCardId} isNew={isRecipeNew(recipe)} recipe={recipe} recipeIndex={recipeIndex} onView={doQuickViewSidebar} onSave={doSave} />)
              }
            </Col>
          ))}
        </Row>
        {recipes.length > 0 && (<>
          <br /><br />
          <Paginate totalCount={recipeCount} pageOffset={pageOffset} size={size} dataSource={recipes} onPage={getPage} />
        </>)}
        {quickViewRecipe && (
          (quickViewRecipe.recipes && quickViewRecipe.recipes.length)  
            ? (<QuickViewCompilationModal show={isRecipeModalShown} onClose={closeQuickViewModal} compilation={quickViewRecipe} onSave={doSave} />)
            : (<QuickViewModal show={isRecipeModalShown} onClose={closeQuickViewModal} recipe={quickViewRecipe} />)
        )}
        {isSaveRecipeModalShown && (
          <SaveRecipeModal recipesToSave={recipesToSave} recipesSaved={recipesSaved} show={isSaveRecipeModalShown} isSavingRecipe={isSavingRecipe} onClose={onSaveClose} />
        )}
      </Container>
    </MainContainer>
  );
};

export default TastyRecipes;