import { LikeTypesByZeroIndex } from './Post/LikeButton';

// createPost and updatePost is sent by createPostMutation and updatePostMutation a single object
const createPost = async ({user, payload}) => {
  try {
    console.log('createPost:', 'user=', user, 'payload=', payload);
    const result = await fetch(`/api/users/${user.uuid}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });
    const post = await result.json();
    return post;
  }
  catch (e) {
    console.error('createPost error: ', e);
    throw e;
  }
};

const updatePost = async ({user, payload}) => {
  try {
    console.log('updatePost:', 'user=', user, 'payload=', payload);
    const result = await fetch(`/api/users/${user.uuid}/posts/${payload.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });
    const post = await result.json();
    return post;
  }
  catch (e) {
    console.error('updatePost error:', e);
    throw e;
  }
};

const updateLike = async ({ post, recipeId, user, payload }) => {
  console.log('updateLike', recipeId);
  try {
    let url = `/api/users/${user.uuid}/posts/${post.id}` + (recipeId >= 0 ? `/recipes/${recipeId}` : '') + '/like';
    console.log('updateLike url', url);
    const result = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await result.json();
    return json;
  }
  catch (e) {
    console.error(e);
  }
};

const updateUnlike = async ({ post, recipeId, user, payload }) => {
  console.log('updateUnlike', recipeId);
  try {
    let url = `/api/users/${user.uuid}/posts/${post.id}` + (recipeId >= 0 ? `/recipes/${recipeId}` : '') + '/unlike';
    console.log('updateUnlike url', url);
    const result = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(payload)
    });
    const json = await result.json();
    return json;
  }
  catch (e) {
    console.error(e);
  }
};

const optimisticUpdateLikePost = (post, recipeIndex, payload) => {
  const statIndex = recipeIndex + 1;
  let like_type = null;
  if (recipeIndex >= 0) {
    post.recipes[recipeIndex].liked = true;
    post.recipes[recipeIndex].like_type = LikeTypesByZeroIndex[payload.like - 1].key;
    like_type = post.recipes[recipeIndex].like_type;
  }
  else {
    post.liked = true;
    post.like_type = LikeTypesByZeroIndex[payload.like - 1].key;
    like_type = post.like_type;
  }
  post.stats[statIndex][like_type]++;
  post.stats[statIndex].total_likes++;
  if (payload.prev) {
    const prev_type = LikeTypesByZeroIndex[payload.prev - 1].key;
    console.log('Deduct 1 from ', prev_type);
    post.stats[statIndex][prev_type] = Math.max(0, post.stats[statIndex][prev_type] - 1);
    post.stats[statIndex].total_likes = Math.max(0, post.stats[statIndex].total_likes - 1);
  }
};

const successUpdateLikePost = (post, data, recipeIndex) => {
  const statIndex = recipeIndex + 1;
  if (recipeIndex >= 0) {
    post.recipes[recipeIndex].liked = true;
    post.recipes[recipeIndex].like_type = data.like_type;
  }
  else {
    post.liked = true;
    post.like_type = data.like_type;
  }
  for (const p in data.stats) {
    post.stats[statIndex][p] = data.stats[p];  
  }
  post.stats[statIndex].total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + post.stats[statIndex][c.key], 0);
};

const doUpdateLike = async ({post, recipeIndex, user, payload}, queryClient, queryKey, updateLocalPost, onError) => {
  let value = null, previousValue = null;
  try {
    await queryClient.cancelQueries(queryKey);
    value = queryClient.getQueryData(queryKey);
    console.log('doUpdateLike:', 'value=', value);
    previousValue = JSON.parse(JSON.stringify(value));

    // const statIndex = recipeIndex + 1;
    // Do optimistic update on cached post
    let index = value.findIndex(p => p.id == post.id);
    if (index != -1) {
      const curPost = value[index];
      /*
      if (recipeIndex >= 0) {
        curPost.recipes[recipeIndex].liked = true;
        curPost.recipes[recipeIndex].like_type = LikeTypesByZeroIndex[payload.like - 1].key;
      }
      else {
        curPost.liked = true;
        curPost.like_type = LikeTypesByZeroIndex[payload.like - 1].key;
      }
      curPost.stats[statIndex][curPost.like_type]++;
      curPost.stats[statIndex].total_likes++;
      if (payload.prev) {
        const prev_type = LikeTypesByZeroIndex[payload.prev - 1].key;
        curPost.stats[statIndex][prev_type]--;
        curPost.stats[statIndex].total_likes--;
      }
      */
      optimisticUpdateLikePost(curPost, recipeIndex, payload);
      if (updateLocalPost) {
        // optimisticUpdateLikePost(localPost, recipeIndex, payload);
        updateLocalPost({...curPost});
      }
      queryClient.setQueryData(queryKey, value);
      console.log('handleUpdateLike Done doing optimistic update.');
    }

    // do call
    const recipeId = recipeIndex >= 0 ? post.recipes[recipeIndex].id : recipeIndex;
    const data = await updateLike({post, recipeId, user, payload});
    console.log('recipeId', recipeId);

    // do onsuccess here
    index = value.findIndex(p => p.id == post.id);
    if (index != -1) {
      const curPost = value[index];
      /*
      if (recipeIndex >= 0) {
        curPost.recipes[recipeIndex].liked = true;
        curPost.recipes[recipeIndex].like_type = data.like_type;
      }
      else {
        curPost.liked = true;
        curPost.like_type = data.like_type;
      }
      for (const p in data.stats) {
        curPost.stats[statIndex][p] = data.stats[p];  
      }
      curPost.stats[statIndex].total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + curPost.stats[statIndex][c.key], 0);
      */
      successUpdateLikePost(curPost, data, recipeIndex);
      if (updateLocalPost) {
        // successUpdateLikePost(localPost, data, recipeIndex);
        updateLocalPost({...curPost});
      }
      queryClient.setQueryData(queryKey, value);
    }
    else {
      console.log('doUpdateLike: searching for data AFTER SUBMIT...NOTFOUND');
    }
  }
  catch (e) {
    console.log('doUpdateLike', e);
    // toast('Something happened while unliking the post. Please try again later.');
    onError(e);
    queryClient.setQueryData(queryKey, previousValue);
  }
};

const optimisticUpdateUnlikePost = (post, recipeIndex) => {
  const statIndex = recipeIndex + 1;
  let like_type = null;
  if (recipeIndex >= 0) {
    like_type = post.recipes[recipeIndex].like_type;
    post.recipes[recipeIndex].liked = false;
    post.recipes[recipeIndex].like_type = null;
  }
  else {
    like_type = post.like_type;
    post.liked = false;
    post.like_type = null;
  }
  post.stats[statIndex][like_type] = Math.max(0, post.stats[statIndex][like_type] - 1);
  post.stats[statIndex].total_likes = Math.max(0, post.stats[statIndex].total_likes - 1);
};

const successUpdateUnlikePost = (post, data, recipeIndex) => {
  const statIndex = recipeIndex + 1;
  if (recipeIndex >= 0) {
    post.recipes[recipeIndex].liked = false;
    post.recipes[recipeIndex].like_type = null;
  }
  else {
    post.liked = false;
    post.like_type = null;
  }
  for (const p in data.stats) {
    post.stats[statIndex][p] = data.stats[p];  
  }
  post.stats[statIndex].total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + post.stats[statIndex][c.key], 0);
};

const doUpdateUnlike = async ({post, recipeIndex, user, payload}, queryClient, queryKey, updateLocalPost, onError) => {
  let value = null, previousValue = null;
  try {
    await queryClient.cancelQueries(queryKey);
    value = queryClient.getQueryData(queryKey);
    console.log('doUpdateUnlike:', 'value=', value);
    console.log('post:', post);
    console.log('recipeIndex:', recipeIndex);
    console.log('recipe:', post.recipes[recipeIndex]);
    previousValue = JSON.parse(JSON.stringify(value));

    // const statIndex = recipeIndex + 1;
    // Do optimistic update on cached post
    let index = value.findIndex(p => p.id == post.id);
    if (index != -1) {
      const curPost = value[index];
      /*
      curPost.stats[statIndex][curPost.like_type]--;
      curPost.stats[statIndex].total_likes--;
      if (recipeIndex >= 0) {
        curPost.recipes[recipeIndex].liked = false;
        curPost.recipes[recipeIndex].like_type = null;
      }
      else {
        curPost.liked = false;
        curPost.like_type = null;
      }
      */
      optimisticUpdateUnlikePost(curPost, recipeIndex);
      if (updateLocalPost) {
        // optimisticUpdateUnlikePost(localPost, recipeIndex);
        updateLocalPost({...curPost});
      }
      queryClient.setQueryData(queryKey, value);
      console.log('handleUpdateUnlike Done doing optimistic update.');
    }

    // do call
    const recipeId = recipeIndex >= 0 ? post.recipes[recipeIndex].id : recipeIndex;
    const data = await updateUnlike({post, recipeId, user, payload});

    // do onsuccess here
    index = value.findIndex(p => p.id == post.id);
    if (index != -1) {
      const curPost = value[index];
      /*
      if (recipeIndex >= 0) {
        curPost.recipes[recipeIndex].liked = false;
        curPost.recipes[recipeIndex].like_type = null;
      }
      else {
        curPost.liked = false;
        curPost.like_type = null;
      }
      for (const p in data.stats) {
        curPost.stats[statIndex][p] = data.stats[p];  
      }
      curPost.stats[statIndex].total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + curPost.stats[statIndex][c.key], 0);
      */
      successUpdateUnlikePost(curPost, data, recipeIndex);
      if (updateLocalPost) {
        // successUpdateUnlikePost(post, data, recipeIndex);
        updateLocalPost({...curPost});
      }
      queryClient.setQueryData(queryKey, value);
    }
    else {
      console.log('doUpdateUnlike: searching for data AFTER SUBMIT...NOTFOUND');
    }
  }
  catch (e) {
    console.log('doUpdateUnlike', e);
    // toast('Something happened while unliking the post. Please try again later.');
    onError(e);
    queryClient.setQueryData(queryKey, previousValue);
  }
};

export {createPost, updatePost, doUpdateLike, doUpdateUnlike};