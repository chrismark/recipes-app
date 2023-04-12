import { useQuery, useQueryClient } from 'react-query';

// TODO: Handle auto-request new Token inside functions that uses fetch()

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

const fetchPostLikes = async (uuid, token, post_id, recipe_id, like, complete, usersOnly) => {
  const url = `/api/users/${uuid}/posts/${post_id}/` + (recipe_id ? `recipes/${recipe_id}/` : '') + `likes` + (like ? `/${like}` : '') + '?' + [complete ? 'complete' : '', usersOnly ? 'usersOnly' : ''].join('&');
  console.log('fetchPostLikes url: ', url);
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

const useUserPosts = (uuid, token, page) => {
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

const usePostLikes = (uuid, token, post_id, recipe_id, like) => {
  console.log('post_id=', post_id);
  console.log('recipe_id=', recipe_id);
  console.log('like=', like);
  const queryData = useQuery(
    ['post-likes', uuid, token, post_id, recipe_id, like], 
    async () => fetchPostLikes(uuid, token, post_id, recipe_id, like),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000 * 5,
    },
  );
  return queryData;
};

const usePostModalLikesInitial = (uuid, token, post_id, recipe_id, like) => {
  const queryClient = useQueryClient();
  const queryData = useQuery(
    ['post-likes-modal-initial', uuid, token, post_id, recipe_id, like, true], 
    async () => fetchPostLikes(uuid, token, post_id, recipe_id, like, true),
    { 
      onSuccess: (data) => {
        queryClient.setQueryData(['post-likes-modal', uuid, token, post_id, recipe_id, like, true, true], {users: data.users});
      },
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      // staleTime: 20 * 1000,
      cacheTime: 60 * 1000,
    },
  );
  return queryData;
};

const usePostModalLikesSucceeding = (uuid, token, post_id, recipe_id, initialLike, like) => {
  const queryData = useQuery(
    ['post-likes-modal', uuid, token, post_id, recipe_id, like, true, true], 
    async () => fetchPostLikes(uuid, token, post_id, recipe_id, like, true, true),
    { 
      enabled: initialLike != like, // type clicked to open modal window != type clicked later
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: 60 * 1000,
      cacheTime: 60 * 1000,
    },
  );
  return queryData;
};

export { useUserPosts, usePostLikes, usePostModalLikesInitial, usePostModalLikesSucceeding };