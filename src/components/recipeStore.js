import { useQuery, useMutation } from 'react-query';

// TODO: Handle auto-request new Token inside functions that uses fetch()

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

/* RecipeComments */
const fetchComments = async (token, recipe_id, comment_id, page = 0) => {
  const url = `/api/recipes/${recipe_id}/comments` + (comment_id ? `/${comment_id}` : `?page=${page}`);
  console.log('url: ', url);
  const result = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await result.json();
  console.log('result: ', result);
  console.log('data: ', data);
  return data;
};

const submitComment = async ({token, recipe_id, id, parent_id, message}) => {
  const url = `/api/recipes/${recipe_id}/comments` + (id != -1 ? `/${id}` : '');
  console.log('url: ', url);
  const result = await fetch(url, {
    method: id != -1 ? 'PATCH' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(id != -1 ? { id, message } : { parent_id, message })
  });
  const data = await result.json();
  console.log('result: ', result);
  console.log('data: ', data);
  return data;
};

const deleteComment = async ({token, recipe_id, comment_id}) => {
  const url = `/api/recipes/${recipe_id}/comments/${comment_id}`;
  const result = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await result.json();
  console.log('result: ', result);
  console.log('data: ', data);
  return data;
};
/* */

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

const useSubmitRating = (queryClient, user) => {
  return useMutation(
    submitRating,
    {
      onMutate: async (variables) => {
        console.log('updateRecipeRatingMutation: onMutate variables=', variables);
        await queryClient.cancelQueries(['recipe', user?.uuid, user?.token, variables.recipe_id]);
        const previousValue = queryClient.getQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id]);
        console.log('updateRecipeRatingMutation: onMutate previousValue=', previousValue);
        // optimistic update
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], {...previousValue, rating: variables.rating });
        return previousValue;
      },
      onSuccess: function (data, variables, previousValue) {
        console.log('updateRecipeRatingMutation: onSuccess data=', data, 'variables=', variables, 'previousValue=', previousValue);
        if (data.errorMessage) {
          return;
        }
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], {...previousValue, ...data});
      },
      onError: (err, variables, previousValue) => {
        queryClient.setQueryData(['recipe', user?.uuid, user?.token, variables.recipe_id], previousValue);
        // toast('Something happened while updating the post. Please try again later.');
      }
    }
  );
};

const useRecipeComments = (token, recipe_id, comment_id, page ) => {
  console.log('useRecipeComments::react-query fetching');
  const queryData = useQuery(
    ['recipe-comments', token, recipe_id, comment_id, page], 
    async () => fetchComments(token, recipe_id, comment_id, page),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      staleTime: 0,
      cacheTime: 60 * 1000 * 5,
    },
  );
  return queryData;
};

const useRecipeCommentReplies = (token, recipe_id, comment_id, page ) => {
  console.log('useRecipeCommentReplies::react-query fetching');
  const queryData = useQuery(
    ['recipe-comments', token, recipe_id, comment_id, page], 
    async () => fetchComments(token, recipe_id, comment_id, page),
    { 
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: !!comment_id,
      staleTime: 0,
      cacheTime: 60 * 1000 * 5,
    },
  );
  return queryData;
};

const useSubmitComment = (queryClient, page) => {
  return useMutation(
    submitComment,
    {
      onMutate: async (variables) => {
        console.log('useSubmitComment: variables=', variables);
        await queryClient.cancelQueries(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
        console.log('Fetch query key=', ['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
        return queryClient.getQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
      },
      onSuccess: function (data, variables, previousValue) {
        console.log('useSubmitComment: onSuccess data=', data, 'variables=', variables, 'previousValue=', previousValue);
        if (data.errorMessage) {
          return;
        }
        if (Array.isArray(previousValue)) {
          if (data.updated_on) { // update
            const index = previousValue.findIndex(c => c.id == data.id);
            if (index != -1) {
              previousValue[index] = {...previousValue[index], ...data};
            }
          }
          else { // create
            previousValue.unshift(data);
          }
        }
        console.log('Update query key=', ['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
        queryClient.setQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page], previousValue);
      },
      onError: (err, variables, previousValue) => {
        console.log('useSubmitComment: onError err=', err);
        queryClient.setQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page], previousValue);
        // toast('Something happened while updating the post. Please try again later.');
      }
    }
  );
};

const useDeleteComment = (queryClient, page) => {
  return useMutation(
    deleteComment,
    {
      onMutate: async (variables) => {
        await queryClient.cancelQueries(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
        const previousValue = queryClient.getQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page]);
        return previousValue;
      },
      onSuccess: function (data, variables, previousValue) {
        console.log('useSubmitComment: onSuccess data=', data, 'variables=', variables, 'previousValue=', previousValue);
        if (data.errorMessage) {
          return;
        }
        const index = previousValue.findIndex(c => c.id == data.id);
        if (index != -1) {
          previousValue[index].deleted = true;
        }
        queryClient.setQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page], previousValue);
      },
      onError: (err, variables, previousValue) => {
        console.log('useSubmitComment: onError err=', err);
        queryClient.setQueryData(['recipe-comments', variables.token, variables.recipe_id, variables.parent_id, page], previousValue);
        // toast('Something happened while updating the post. Please try again later.');
      }
    }
  );
};


export { useRecipes, useRecipe, useSubmitRating, useSubmitComment, useDeleteComment, useRecipeComments, useRecipeCommentReplies };