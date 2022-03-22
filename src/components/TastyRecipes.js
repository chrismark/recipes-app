import { useState, useEffect } from 'react';
import { Pagination, Modal, Badge, Figure, Offcanvas, Container, Card, Row, Col, ListGroup, ListGroupItem, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import RecipeCompilation from './RecipeCompilation';
import RecipeShort from './RecipeShort';

const TastyRecipes = ({ user }) => {
  const [recipes, setRecipes] = useState([]);
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
  const OneDayMs = 24 * 60 * 60 * 1000;

  useEffect(() => {
    getRecipes();
  }, [pageOffset]);

  const isRecipeNew = ({ approved_at }) => {
    let recipeApprovedDate = new Date(approved_at * 1000);
    let diff = Date.now() - recipeApprovedDate;
    return diff < OneDayMs;
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
    setIsFetchingRecipes(true);
    const data = await fetchRecipes(user.token);
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
    return (await result.json());
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
      {recipes.map((recipe, recipeIndex) => (
        <Col md={5} key={recipe.id}>
          {recipe.recipes && recipe.recipes.length ?
            (<RecipeCompilation isNew={isRecipeNew(recipe)} compilation={recipe} compilationIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
            :
            (<RecipeShort isNew={isRecipeNew(recipe)} recipe={recipe} recipeIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
          }
        </Col>
      ))}
      </Row>
      {recipes.length > 0 && (
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
      )}
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