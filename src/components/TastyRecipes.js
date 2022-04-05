import { useState, useEffect } from 'react';
import { Pagination, Container, Row, Col, Spinner, Placeholder, Card, ListGroup, ListGroupItem } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import RecipeCompilation from './RecipeCompilation';
import RecipeShort from './RecipeShort';
import QuickViewModal from './QuickViewModal';
import QuickViewCompilationModal from './QuickViewCompilationModal';
import RecipePaginate from './RecipePaginate';
import MainContainer from './MainContainer';
import RecipePlaceholder from './RecipePlaceholder';


const TastyRecipes = ({ user }) => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(-1);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [quickViewRecipe, setQuickViewRecipe] = useState(null);
  const [isRecipeModalShown, setIsRecipeModalShown] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [enableFirstPageLink, setEnableFirstPageLink] = useState(false);
  const [enablePrevPageLink, setEnablePrevPageLink] = useState(false);
  const [enableNextPageLink, setEnableNextPageLink] = useState(false);
  const [enableLastPageLink, setEnableLastPageLink] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const size = 20;
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;
  const NewDaysMs = 2 * 24 * 60 * 60 * 1000;

  useEffect(() => {
    if (user) {
      // getRecipes();
    }
  }, [pageOffset]);

  const isRecipeNew = ({ approved_at }) => {
    let recipeApprovedDate = new Date(approved_at * 1000);
    let diff = Date.now() - recipeApprovedDate;
    return diff < NewDaysMs;
  };

  const determinePageLinkAbleness = () => {
    const isFirstPageLinkEnabled = !(pageOffset > 0);
    const isOtherPageLinkEnabled = !( recipeCount - (size * (pageOffset + 1)) );
    setEnableFirstPageLink(isFirstPageLinkEnabled);
    setEnablePrevPageLink(isFirstPageLinkEnabled);
    setEnableNextPageLink(isOtherPageLinkEnabled);
    setEnableLastPageLink(isOtherPageLinkEnabled);
  };

  const getFirstPage = async () => {
    setPageOffset(0);
  };

  const getPrevPage = async () => {
    setPageOffset(Math.max(0, pageOffset - size));
  };

  const getNextPage = async () => {
    console.log('pageOffset before: ', pageOffset);
    setPageOffset(Math.min(recipeCount, pageOffset + size));
    console.log('pageOffset after: ', pageOffset);
  };

  const getLastPage = async () => {
    setPageOffset(Math.floor(recipeCount / size));
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
    setIsFetchingRecipes(false);
    setRecipeCount(data.count);
    setRecipes(data.results);
    determinePageLinkAbleness();
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
        <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} className='gy-4'>
          {isFetchingRecipes && (<>
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
              {recipe.recipes && recipe.recipes.length ?
                (<RecipeCompilation activeCardId={activeCardId} isNew={isRecipeNew(recipe)} compilation={recipe} compilationIndex={recipeIndex} onClickView={doQuickViewSidebar} />)
                :
                (<RecipeShort activeCardId={activeCardId} isNew={isRecipeNew(recipe)} recipe={recipe} recipeIndex={recipeIndex} onClickView={doQuickViewSidebar} />)
              }
            </Col>
          ))}
        </Row>
        {recipes.length > 0 && (<>
          <RecipePaginate recipeCount={recipeCount} pageOffset={pageOffset} size={size} recipes={recipes} onFirstPage={getFirstPage} onPrevPage={getPrevPage} onNextPage={getNextPage} onLastPage={getLastPage} />
        </>)}
        {quickViewRecipe && (
          (quickViewRecipe.recipes && quickViewRecipe.recipes.length) ? 
            (<QuickViewCompilationModal show={isRecipeModalShown} onClose={closeQuickViewModal} compilation={quickViewRecipe} />)
            :
            (<QuickViewModal show={isRecipeModalShown} onClose={closeQuickViewModal} recipe={quickViewRecipe} />)
        )}
      </Container>
    </MainContainer>
  );
};

export default TastyRecipes;