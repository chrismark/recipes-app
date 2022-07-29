import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';

const fetchRecipes = async (uuid, token, page, mode) => {
  const url = `/api/users/${uuid}/recipes?page=${page}&mode=${mode}`;
  console.log('fetchRecipes url: ', url);
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  console.log('result: ', result);
  return result.json();
  // return data;
};

const useRecipes = (uuid, token, page, mode) => {
  console.log('react-query fetching');
  const queryData = useQuery(
    ['recipes', uuid, token, page], 
    async () => fetchRecipes(uuid, token, page, mode),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      //staleTime: (60 * 1000 * 5),
    },
  );
  return queryData;
};

const _useRecipes = (uuid, token, page, mode) => {
  const [recipes, setRecipes] = useState(null);
  const [error, setError] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    getRecipes();
  }, [page]);

  const getRecipes = async () => {
    console.log('getRecipes');
    setIsFetching(true);
    try {
      const data = await fetchRecipes(uuid, token, page, mode);
      setRecipes(data);
    }
    catch (e) {
      setError(e);
    }
    setIsFetching(false);
  }

  return {
    recipes,
    setRecipes,
    error,
    isFetching
  };
};

export { useRecipes };