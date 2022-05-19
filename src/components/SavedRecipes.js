import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import MainContainer from './MainContainer';
import Paginate from './Paginate';
import Recipe from './recipe/SavedRecipe';
import RecipePlaceholder from './recipe/RecipePlaceholder';
import Loading from './Loading';

const SavedRecipes = ({ user }) => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [recipeCount, setRecipeCount] = useState(-1);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [pageOffset, setPageOffset] = useState(0);
  const [page, setPage] = useState(1);
  const [recipe, setRecipe] = useState(null);

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
    const url = `/api/users/${user.uuid}/recipes?page=${page}`;
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
    // <MainContainer user={user}>
    <>
      <Loading show={isFetchingRecipes} />
      <Outlet context={{ recipes, isFetchingRecipes, isInitialLoad, activeCardId }} />
    </>
    // </MainContainer>
  );
};

export default SavedRecipes;