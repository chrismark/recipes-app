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
  if (result.status == 401) {
    throw new Error('Token expired.');
  }
  return result.json();
};

const useRecipes = (uuid, token, page, mode) => {
  console.log('react-query fetching');
  const queryData = useQuery(
    ['recipes', uuid, token, page], 
    async () => fetchRecipes(uuid, token, page, mode),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: (60 * 1000),
      cacheTime: 60 * 1000,
    },
  );
  return queryData;
};

export { useRecipes };