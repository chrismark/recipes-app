import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ListSavedRecipes from './recipe/ListSavedRecipes';
import MainContainer from './MainContainer';

const SavedRecipes = ({ user }) => {
  const navigate = useNavigate();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [recipes, setRecipes] = useState([]);
  const [isFetchingRecipes, setIsFetchingRecipes] = useState(false);
  const [activeCardId, setActiveCardId] = useState(-1);
  const [page, setPage] = useState(1);
  const mounted = useRef(null);

  useEffect(() => {
    if (mounted.current == null) {
      console.log('Mounted SavedRecipes');
      mounted.current = true;
    }
    return () => {
      console.log('Dismounted SavedRecipes');
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    console.log('SavedRecipes: useEffect:', 'user=', user);
    if (user) {
      getRecipes();
    }
  }, [page]);

  const getRecipes = async () => {
    if (isFetchingRecipes) { return; }
    setIsFetchingRecipes(true);
    const [data, status] = await fetchRecipes(user.token);
    if (!mounted.current) { return; }
    if (status !== 200) {
      setIsFetchingRecipes(false);
      setRecipes([]);
      console.log('navigating to /login');
      return setTimeout(() => navigate('/login'), 500);
    }
    setIsInitialLoad(false);
    setIsFetchingRecipes(false);
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
    <ListSavedRecipes recipes={recipes} isFetchingRecipes={isFetchingRecipes} isInitialLoad={isInitialLoad} activeCardId={activeCardId} />
  );
};

export default SavedRecipes;