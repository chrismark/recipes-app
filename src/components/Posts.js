import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useQueryClient, useMutation } from 'react-query';
import Paginate from './Paginate';
import CreateEditPostModal from './CreateEditPostModal';
import SelectRecipeModal from './SelectRecipeModal';
import AddRecipeCaptionModal from './AddRecipeCaptionModal';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { toast } from './Toaster';
import Post from './Post/Post';
import PostPlaceholder from './Post/PostPlaceholder';
import CreatePostModalLauncher from './CreateEditPostModalLauncher';
import { useUserPosts } from './postStore';
import { LikeTypesByZeroIndex } from './Post/LikeButton';

const createPost = async ({ user, payload }) => {
  try {
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
    console.error(e);
  }
};

const updatePost = async ({ user, payload }) => {
  try {
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
    console.error(e);
  }
};

const updateLike = async ({ post, user, payload }) => {
  console.log('updateLike', post, user, payload);
  try {
    const result = await fetch(`/api/users/${user.uuid}/posts/${post.id}/like`, {
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

const updateUnlike = async ({ post, user, payload }) => {
  console.log('updateLike', post, user, payload);
  try {
    const result = await fetch(`/api/users/${user.uuid}/posts/${post.id}/unlike`, {
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

const Posts = ({ user, byUser }) => {
  console.log('Posts rerender');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [postId, setPostId] = useState(null);
  const [postMessage, setPostMessage] = useState('');
  const [pageOffset, setPageOffset] = useState(0);
  const useUserPostsResult = useUserPosts(user?.uuid, user?.token, pageOffset);
  const { data: posts, error, isFetching, isLoading } = useUserPostsResult;
  const [showForm, setShowForm] = useState(false);
  const [showCreateEditPostModal, setShowCreateEditPostModal] = useState(false);
  const [showSelectRecipeModal, setShowSelectRecipeModal] = useState(false);
  const [showAddRecipeCaptionModal, setShowAddRecipeCaptionModal] = useState(false);
  const [postsByUser, setPostsByUser] = useState(true);
  const queryClient = useQueryClient();
  const size = 20;
  const postCount = 300;

  // TODO: Continuosly load more posts when user scrolls to bottom most
  // TODO: Load posts made by user

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    setPageOffset((page - 1) * size);
  };

  const createPostMutation = useMutation(
    createPost,
    {
      onMutate: async post => {
        console.log('createPostMutation');
        await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
        return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
      },
      onSuccess: function (data, variables, previousValue) {
        // add new post to cache
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], [data, ...previousValue]);
      },
      onError: (err, variables, previousValue) => {
        // TODO: do something on error
        toast('Something happened while creating the post. Please try again later.');
      }
    }
  );

  const updatePostMutation = useMutation(
    updatePost,
    {
      onMutate: async post => {
        console.log('createPostMutation');
        await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
        return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
      },
      onSuccess: function (data, variables, previousValue) {
        // update post in cache
        let index = previousValue.findIndex(p => p.id == data.id);
        if (index != -1) {
          previousValue[index].message = data.message;
          previousValue[index].recipes = data.recipes;
          previousValue[index].stats = data.stats;
          queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], [...previousValue]);
        }
      },
      onError: (err, variables, previousValue) => {
        // TODO: do something on error
        toast('Something happened while updating the post. Please try again later.');
      }
    }
  );

  const onCreatePostSubmit = async (e) => {
    e.preventDefault();
    console.log('POST: ', selectedRecipes);
    // remove unneeded fields
    let recipes = selectedRecipes.map(r => {
      let {id, caption} = r;
      return {id, caption};
    });
    let newPost = {
      message: postMessage,
      recipes: recipes
    };
    const post = await createPostMutation.mutateAsync({ user, newPost });
    console.log('New post: ', post);
    toast('New post added!');
    setShowCreateEditPostModal(false);
    setSelectedRecipes([]);
    setPostMessage('');
  };

  const onUpdatePostSubmit = async (e) => {
    try {
      e.preventDefault();
      console.log('Update POST: ', selectedRecipes);
      console.log('Update Post Message: ', postMessage);
      console.log('Update Post Id: ', postId);
      // remove unneeded fields
      let order = 0;
      let recipes = selectedRecipes.map(r => {
        let {post_id, id, caption, deleted} = r;
        if (deleted) {
          return {post_id, id, caption, deleted};
        }
        return {post_id, id, caption, deleted, order: order++};
      });
      let editPost = {
        id: postId,
        message: postMessage,
        recipes: recipes
      };
      console.log('PATCH POST ', editPost);
      let post = await updatePostMutation.mutateAsync({user, editPost});
      console.log('Update post: ', post);
      setShowCreateEditPostModal(false);
      setPostId(null);
      setPostMessage('');
      setSelectedRecipes([]);
      toast('Updated post!');
    }
    catch (e) {
      console.log('Error updating: ', e);
    }
  };
  //
  // TODO: Make it so not all posts rerender when a single post is liked
  //
  const handleUpdateLike = async ({post, user, payload}) => {
    let previousValue = null;
    try {
      await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset]);
      previousValue = queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset]);

      // Do optimistic update on cached post
      let index = previousValue.findIndex(p => p.id == post.id);
      if (index != -1) {
        const curPost = previousValue[index];
        curPost.liked = true;
        curPost.like_type = LikeTypesByZeroIndex[payload.like - 1].key;
        curPost.stats[curPost.like_type]++;
        curPost.stats.total_likes++;
        if (payload.prev) {
          const prev_type = LikeTypesByZeroIndex[payload.prev - 1].key;
          curPost.stats[prev_type]--;
          curPost.stats.total_likes--;
        }
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
        console.log('handleUpdateUnlike Done doing optimistic update.');
      }

      // do call
      const data = await updateLike({post, user, payload});
      
      // do onsuccess here
      index = previousValue.findIndex(p => p.id == post.id);
      if (index != -1) {
        const curPost = previousValue[index];
        curPost.liked = true;
        curPost.like_type = data.like_type;
        for (const p in data.stats) {
          curPost.stats[p] = data.stats[p];  
        }
        curPost.stats.total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + curPost.stats[c.key], 0);
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
      }
    }
    catch (e) {
      console.log('handleUpdateUnlike', e);
      toast('Something happened while unliking the post. Please try again later.');
      queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
    }
  };

  const handleUpdateUnlike = async ({post, user, payload}) => {
    let previousValue = null;
    try {
      await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset]);
      previousValue = queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset]);

      // Do optimistic update on cached post
      let index = previousValue.findIndex(p => p.id == post.id);
      if (index != -1) {
        const curPost = previousValue[index];
        curPost.liked = false;
        curPost.stats[curPost.like_type]--;
        curPost.like_type = null;
        curPost.stats.total_likes--;
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
        console.log('handleUpdateUnlike Done doing optimistic update.');
      }

      // do call
      const data = await updateUnlike({post, user, payload});
      
      // do onsuccess here
      index = previousValue.findIndex(p => p.id == post.id);
      if (index != -1) {
        const curPost = previousValue[index];
        curPost.liked = false;
        post.like_type = null;
        for (const p in data.stats) {
          curPost.stats[p] = data.stats[p];  
        }
        curPost.stats.total_likes = LikeTypesByZeroIndex.reduce((p,c) => p + curPost.stats[c.key], 0);
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
      }
    }
    catch (e) {
      console.log('handleUpdateUnlike', e);
      toast('Something happened while unliking the post. Please try again later.');
      queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], previousValue);
    }
  };

  const onCreateEditPostClose = () => {
    console.log('')
    setShowCreateEditPostModal(false);
    if (postId != null) {
      setPostId(null);
      setPostMessage('');
    }
    setSelectedRecipes([]);
  };

  const onAddARecipe = () => {
    console.log('Add a recipe!');
    setShowSelectRecipeModal(true);
  };

  const onSelectRecipeSubmit = () => {
    setShowSelectRecipeModal(false);
  };

  const onSelectRecipeBack = () => {
    setShowSelectRecipeModal(false);
  };

  const clearSelectedRecipes = () => {
    console.log('clear selected recipes');
    setSelectedRecipes([]);
  }

  const onAddRecipeCaption = () => {
    console.log('Add Recipe Caption');
    setShowAddRecipeCaptionModal(true);
  }

  const onAddRecipeCaptionDone = () => {
    setShowAddRecipeCaptionModal(false);
  }

  const onAddRecipeCaptionBack = () => {
    setShowAddRecipeCaptionModal(false);
  }

  const onEditPost = (post) => {
    console.log('Edit Post: ', post);
    setPostId(post.id);
    setPostMessage(post.message);
    setSelectedRecipes(JSON.parse(JSON.stringify(post.recipes)));
    setShowCreateEditPostModal(true);
  };

  return (
    <Container fluid className='recipes-app-posts'>
      <Row>
        <Col className='left-sidebar'>
          Left
        </Col>
        <Col className='justify-content-md-center'>
          <div className='mid-content'>
          {user && (
          <Row className='justify-content-md-center'>
            <Col className='mb-5 mt-0'>
              <CreatePostModalLauncher
                text='What food are you craving right now?'
                onClick={() => { 
                    setShowCreateEditPostModal(true);
                }}
                />
            </Col>
          </Row>
          )}
          <Row xs={1} className='posts-list gy-4'>
            {isLoading && (<>
              <Col className='justify-content-md-center' key={1}>
                <PostPlaceholder />
              </Col>
              <Col className='justify-content-md-center' key={2}>
                <PostPlaceholder />
              </Col>
              <Col className='justify-content-md-center' key={3}>
                <PostPlaceholder />
              </Col>
            </>)}
            {posts && posts.map(post => (
              <Col className='justify-content-md-center' key={post.id}>
                <Post user={user} post={post} onEditPost={onEditPost} onLike={handleUpdateLike} onUnlike={handleUpdateUnlike} />
              </Col>
            ))}
          </Row>
          {/* {posts && posts.length > 0 && (<>
            <br/><br/>
            <Paginate totalCount={postCount} pageOffset={pageOffset} size={size} dataSource={posts} onPage={getPage} />
          </>)} */}
          </div>
        </Col>
        <Col className='right-sidebar'>
          Right
        </Col>
      </Row>
      
      {user && (
      <>
        <CreateEditPostModal 
          show={showCreateEditPostModal} 
          postId={postId} 
          postMessage={postMessage}
          onCreateSubmit={onCreatePostSubmit} 
          onUpdateSubmit={onUpdatePostSubmit} 
          onAddARecipe={onAddARecipe} 
          onEditCaption={onAddRecipeCaption}
          onClose={onCreateEditPostClose} 
          setPostMessage={setPostMessage}
          selectedRecipes={selectedRecipes}
          setSelectedRecipes={setSelectedRecipes}
          clearSelectedRecipes={clearSelectedRecipes} 
          isSubmitting={createPostMutation.isLoading || updatePostMutation.isLoading}
          />
        <SelectRecipeModal 
          postId={postId} 
          user={user} 
          show={showSelectRecipeModal} 
          onSelect={onSelectRecipeSubmit} 
          onClose={onSelectRecipeBack} 
          selectedRecipes={selectedRecipes} 
          setSelectedRecipes={setSelectedRecipes} 
          />
        <AddRecipeCaptionModal
          postId={postId} 
          show={showAddRecipeCaptionModal}
          onDone={onAddRecipeCaptionDone}
          onClose={onAddRecipeCaptionBack}
          selectedRecipes={selectedRecipes}
          setSelectedRecipes={setSelectedRecipes}
          />
      </>
      )}
    </Container>
  );
};

Posts.defaultProps = {
  byUser: false
};

export default Posts;