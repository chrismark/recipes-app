import { useQuery } from 'react-query';

const fetchRecipe = async (uuid, token, recipe_id) => {
  const url = `/api/users/${uuid}/recipes/${recipe_id}`;
  console.log('fetchRecipes url: ', url);
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  return await result.json();
};

const submitRating = async ({token, recipe_id, rating_id, rating}) => {
  try {
    const url = `/api/recipes/${recipe_id}/ratings` + (rating_id != null ? `/${rating_id}` : '');
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({rating})
    });
    return await result.json();
  }
  catch (e) {
    console.error(e);
    throw e;
  }
};

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
  if (result.status == 401) {
    throw new Error('Token expired.');
  }
  return await result.json();
};

const useRecipes = (uuid, token, page, mode) => {
  console.log('useRecipes::react-query fetching');
  const queryData = useQuery(
    ['recipes', uuid, token, page], 
    async () => fetchRecipes(uuid, token, page, mode),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 60 * 1000 * 5,
      cacheTime: 60 * 1000 * 60,
    },
  );
  return queryData;
};

const useRecipe = (uuid, token, recipe_id, initialData) => {
  console.log('useRecipe::react-query fetching');
  const queryData = useQuery(
    ['recipe', uuid, token, recipe_id], 
    async () => fetchRecipe(uuid, token, recipe_id),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 60 * 1000 * 5,
      cacheTime: 60 * 1000 * 60,
      placeholderData: initialData,
      // initialDataUpdatedAt: Date.now() - (10 * 60 * 1000 * 60),
      onSuccess: (data) => {
        console.log('useRecipe: data=', data);
      }
    },
  );
  return queryData;
};

export { useRecipes, useRecipe, submitRating };