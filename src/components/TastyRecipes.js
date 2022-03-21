import { useState, useEffect } from 'react';
import { Pagination, Modal, Badge, Figure, Offcanvas, Container, Card, Row, Col, ListGroup, ListGroupItem, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import RecipeCompilation from './RecipeCompilation';
import RecipeShort from './RecipeShort';

const TastyRecipes = ({ user }) => {
  const [recipes, setRecipes] = useState({data:[], date:Date.now()});
  const [recipeCount, setRecipeCount] = useState(-1);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [quickViewRecipe, setQuickViewRecipe] = useState({});
  const [isRecipeSidebarShown, setIsRecipeSidebarShown] = useState(false);
  const [pageOffset, setPageOffset] = useState(0);
  const [enableFirstPageLink, setEnableFirstPageLink] = useState(false);
  const [enablePrevPageLink, setEnablePrevPageLink] = useState(false);
  const [enableNextPageLink, setEnableNextPageLink] = useState(false);
  const [enableLastPageLink, setEnableLastPageLink] = useState(false);
  const size = 20;
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;

  useEffect(() => {
    getRecipes();
  }, [pageOffset]);

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
    //await getRecipes();
  };

  const getPrevPage = async () => {
    setPageOffset(Math.max(0, pageOffset - size));
    //await getRecipes();
  };

  const getNextPage = async () => {
    console.log('pageOffset before: ', pageOffset);
    setPageOffset(Math.min(recipeCount, pageOffset + size));
    console.log('pageOffset after: ', pageOffset);
    //await getRecipes();
  };

  const getLastPage = async () => {
    setPageOffset(Math.floor(recipeCount / size));
    await getRecipes();
  };

  const getRecipes = async () => {
    const data = await fetchRecipes(user.token);
    setRecipeCount(data.count);
    setRecipes({data: data.results, date: Date.now()});
    determinePageLinkAbleness();
    console.log('count: ', recipeCount);
    console.log('recipes: ', recipes);
  }

  const fetchRecipes = async (token) => {
    setIsFetchingRecipes(true);
    const url = '/api/tasty?offset=' + pageOffset +'&size=' + size;
    console.log('fetchRecipes url: ', url);
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await result.json();
    setIsFetchingRecipes(false);
    return data;
  };

  const doQuickViewSidebar = (index, compilationIndex = -1) => {
    let recipe;
    if (compilationIndex > -1) {
      recipe = recipes.data[compilationIndex];
      recipe = recipe.recipes[index];
    }
    else {
      recipe = recipes.data[index];
    }
    if (recipe.description) {
      recipe.description = replaceLinksWithText(recipe.description);
    }
    setQuickViewRecipe(recipe);
    setIsRecipeSidebarShown(index >= 0);
  };

  const closeQuickViewSidebar = () => {
    setIsRecipeSidebarShown(false);
    setQuickViewRecipe({});
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
    <>
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
      {recipes.data.map((recipe, recipeIndex) => (
        <Col md={5}>
          {recipe.recipes && recipe.recipes.length ?
            (<RecipeCompilation compilation={recipe} compilationIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
            :
            (<RecipeShort isCompilation={recipe.recipes && recipe.recipes.length} recipe={recipe} recipeIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
          }
        </Col>
      ))}
      </Row>
      <Row className='justify-content-md-center'>
        <Col md='auto'>Offset: {pageOffset}, RecipeCount: {recipeCount}</Col>
      </Row>
      <Row className='justify-content-md-center'>
        <Col md='auto'>
          <br/><br/>
          <Pagination>
            <Pagination.First disabled={enableFirstPageLink} onClick={() => getFirstPage()}>First</Pagination.First>
            <Pagination.Prev disabled={enablePrevPageLink} onClick={() => getPrevPage()}>Prev</Pagination.Prev>
            <Pagination.Next disabled={enableNextPageLink} onClick={() => getNextPage()}>Next</Pagination.Next>
            <Pagination.Last disabled={enableLastPageLink} onClick={() => getLastPage()}>Last</Pagination.Last>
          </Pagination>
        </Col>
      </Row>
      { /** TODO: Transfer later to own component -- QuickViewSidebar(recipe) */}
      <Offcanvas show={isRecipeSidebarShown} onHide={closeQuickViewSidebar}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{quickViewRecipe.name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Figure>
            <Figure.Image src={quickViewRecipe.thumbnail_url} />
          </Figure>
          {quickViewRecipe.description}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
    </>
  );
};

export default TastyRecipes;