import { useState, useEffect } from 'react';
import { Badge, Figure, Offcanvas, Container, Card, Row, Col, ListGroup, ListGroupItem, Spinner, Button } from 'react-bootstrap';
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
  let offset = 0;
  const size = 20;
  const regexLink = /<a href="([^"]+)">([^<]+)<\/a>/g;

  useEffect(() => {
    const getRecipes = async () => {
      const data = await fetchRecipes(user);
      setRecipeCount(data.count);
      setRecipes(data.results);
      console.log('count: ', recipeCount);
      console.log('recipes: ', recipes);
    }

    getRecipes();
  }, []);

  const fetchRecipes = async ({ token }) => {
    setIsFetchingRecipes(true);
    const url = '/api/tasty?offset=' + offset +'&size=' + size;
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
      recipe = recipes[compilationIndex];
      recipe = recipe.recipes[index];
    }
    else {
      recipe = recipes[index];
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
    <Container className='justify-content-sm-center justify-content-md-center'>
      <h2>Latest from Tasty.co</h2>
      <br/>
      {isFetchingRecipes && (
        <Row className='justify-content-md-center'>
          <br /><br />
          <Spinner animation="grow" />
          <br /><br /><br />
        </Row>
      )}
      <Row xs={1} sm={1} md={2} lg={3} xl={3} xxl={4} className='g-4'>
      {recipes.map((recipe, recipeIndex) => (
        <Col key={recipe.id}>
          {recipe.recipes && recipe.recipes.length ?
            (<RecipeCompilation compilation={recipe} compilationIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
            :
            (<RecipeShort recipe={recipe} recipeIndex={recipeIndex} onQuickViewSidebar={doQuickViewSidebar} />)
          }
          {/* <Card style={{ width: '18rem'}}>
            <Card.Img variant='top' src={recipe.thumbnail_url} />
            <Card.Body>
              <Card.Title>{recipe.name}</Card.Title>
              <Card.Text style={{fontSize: '0.8em'}}>{recipe.tags.length > 0 ? 'Tags: ' + recipe.tags.map(tag => tag.display_name).join(', ') : ''}</Card.Text>
            </Card.Body>
            <ListGroup className='list-group-flush'>
              <ListGroupItem as={Link} to='#' onClick={() => doQuickViewSidebar(recipeIndex)} style={{textAlign: 'center'}}>Quick view of the recipe</ListGroupItem>
              <ListGroupItem as={Link} to='#' onClick={() => console.log('Saving recipe ' + recipe.name)} style={{textAlign: 'center'}}>Or, save it then rate and comment</ListGroupItem>
            </ListGroup>
          </Card>   */}
        </Col>
      ))}
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
  );
};

export default TastyRecipes;