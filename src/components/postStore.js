import { useQuery } from 'react-query';

const fetchUserPosts = async (uuid, token, page) => {
  const url = `/api/users/${uuid}/posts?page=${page}`;
  console.log('fetchUserPosts url: ', url);
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
  else if (!result.ok) {
    throw new Error('Something is wrong. Please try again.');
  }
  return result.json();
};

const useUserPosts = (uuid, token, page, mode) => {
  console.log('useUserPosts react-query fetching');
  const queryData = useQuery(
    ['user-posts', uuid, token, page], 
    async () => fetchUserPosts(uuid, token, page),
    { 
      keepPreviousData: true, 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 1000 * 5,
      cacheTime: 60 * 1000 * 60,
    },
  );
  return queryData;
};

export { useUserPosts };