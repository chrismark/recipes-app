import { useState, useEffect, useContext } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import { useQueryClient, useMutation } from 'react-query';
import Paginate from './Paginate';
import { AppContext } from '../appContext.js';
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
import { createPost, updatePost, doUpdateLike, doUpdateUnlike } from './postLib';

const Posts = ({ user, byUser }) => {
  // console.log('Posts rerender');
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [postId, setPostId] = useState(null);
  const [postMessage, setPostMessage] = useState('');
  // const [pageOffset, setPageOffset] = useState(0);
  const [{ user: currentUser, pageOffset }, dispatch] = useContext(AppContext);
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

  console.log('Posts', 'currentUser:', currentUser, 'pageOffset:', pageOffset);

  // TODO: Continuosly load more posts when user scrolls to bottom most
  // TODO: Load posts made by user

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    dispatch({ type: 'update_pageOffset', pageOffset: (page - 1) * size });
  };

  const createPostMutation = useMutation(
    createPost,
    {
      onMutate: async post => {
        console.log('createPostMutation onMutate');
        await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
        return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
      },
      onSuccess: function (data, variables, previousValue) {
        console.log('createPostMutation onSuccess:', data, variables);
        if (data.errorMessage) {
          return;
        }
        // add new post to cache
        queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], [data, ...previousValue]);
      },
      onError: (err, variables, previousValue) => {
        console.log('createPostMutation onError:', err, variables);
        // TODO: do something on error
        console.log(err, variables, previousValue);
        toast('Something happened while creating the post. Please try again later.');
      }
    }
  );

  const updatePostMutation = useMutation(
    updatePost,
    {
      onMutate: async post => {
        console.log('updatePostMutation');
        await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
        return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
      },
      onSuccess: function (data, variables, previousValue) {
        if (data.errorMessage) {
          return;
        }
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
        console.log(err, variables, previousValue);
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
    const post = await createPostMutation.mutateAsync({user, payload: newPost});
    console.log('New post: ', post);
    if (post.errorMessage) {
      toast('Something happened while creating the post. Please try again later.');  
    }
    else {
      toast('New post added!');
      setShowCreateEditPostModal(false);
      setSelectedRecipes([]);
      setPostMessage('');
    }
  };

  const onUpdatePostSubmit = async (e) => {
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
    let post = await updatePostMutation.mutateAsync({user, payload: editPost});
    console.log('Update post: ', post);
    if (post.errorMessage) {
      toast('Something happened while updating the post. Please try again later.');
    }
    else {
      setShowCreateEditPostModal(false);
      setPostId(null);
      setPostMessage('');
      setSelectedRecipes([]);
      toast('Updated post!');
    }
  };
  //
  // TODO: Make it so not all posts rerender when a single post is liked
  //
  const onLikeError = (e) => {
    toast('Something happened while liking the post. Please try again later.');
  };

  const onUnlikeError = (e) => {
    toast('Something happened while unliking the post. Please try again later.');
  };

  const handleUpdateLike = async (payload) => {
    await doUpdateLike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], null, onLikeError);
  };

  const handleUpdateUnlike = async (payload) => {
    await doUpdateUnlike(payload, queryClient, ['user-posts', user?.uuid, user?.token, pageOffset], null, onUnlikeError);
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