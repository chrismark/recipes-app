import { useState, useContext, useRef, useReducer } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Outlet } from 'react-router-dom';
import { useQueryClient, useMutation } from 'react-query';
import Posts from './Posts';
import { useStore } from './Toaster';
import { AppStateContext } from '../appContext.js';
import CreateEditPostModal from './CreateEditPostModal';
import SelectRecipeModal from './SelectRecipeModal';
import AddRecipeCaptionModal from './AddRecipeCaptionModal';
import CreatePostModalLauncher from './CreateEditPostModalLauncher';
import { createPost, updatePost } from './postLib';
import MainContainer from './MainContainer';
import CreateEditPost from './CreateEditPost';

const Home = ({ user, children }) => {
  console.log('render Home');
  const createEditPostRef = useRef(null);
  // const [selectedRecipes, setSelectedRecipes] = useState([]);
  // const [postId, setPostId] = useState(null);
  // const [postMessage, setPostMessage] = useState('');
  const { toast } = useStore();
  // const { user, pageOffset } = useContext(AppStateContext);
  // const [showCreateEditPostModal, setShowCreateEditPostModal] = useState(false);
  // const [showSelectRecipeModal, setShowSelectRecipeModal] = useState(false);
  // const [showAddRecipeCaptionModal, setShowAddRecipeCaptionModal] = useState(false);
  // const queryClient = useQueryClient();

  // const createPostMutation = useMutation(
  //   createPost,
  //   {
  //     onMutate: async post => {
  //       console.log('createPostMutation onMutate');
  //       await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
  //       return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
  //     },
  //     onSuccess: function (data, variables, previousValue) {
  //       console.log('createPostMutation onSuccess:', data, variables);
  //       if (data.errorMessage) {
  //         return;
  //       }
  //       // add new post to cache
  //       queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], [data, ...previousValue]);
  //     },
  //     onError: (err, variables, previousValue) => {
  //       console.log('createPostMutation onError:', err, variables);
  //       console.log(err, variables, previousValue);
  //       toast('Something happened while creating the post. Please try again later.');
  //     }
  //   }
  // );

  // const updatePostMutation = useMutation(
  //   updatePost,
  //   {
  //     onMutate: async post => {
  //       console.log('updatePostMutation');
  //       await queryClient.cancelQueries(['user-posts', user?.uuid, user?.token, pageOffset])
  //       return queryClient.getQueryData(['user-posts', user?.uuid, user?.token, pageOffset])
  //     },
  //     onSuccess: function (data, variables, previousValue) {
  //       if (data.errorMessage) {
  //         return;
  //       }
  //       // update post in cache
  //       let index = previousValue.findIndex(p => p.id == data.id);
  //       if (index != -1) {
  //         previousValue[index].message = data.message;
  //         previousValue[index].recipes = data.recipes;
  //         previousValue[index].stats = data.stats;
  //         queryClient.setQueryData(['user-posts', user?.uuid, user?.token, pageOffset], [...previousValue]);
  //       }
  //     },
  //     onError: (err, variables, previousValue) => {
  //       console.log(err, variables, previousValue);
  //       toast('Something happened while updating the post. Please try again later.');
  //     }
  //   }
  // );

  // const onCreatePostSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('POST: ', selectedRecipes);
  //   // remove unneeded fields
  //   let recipes = selectedRecipes.map(r => {
  //     let {id, caption} = r;
  //     return {id, caption};
  //   });
  //   let newPost = {
  //     message: postMessage,
  //     recipes: recipes
  //   };
  //   const post = await createPostMutation.mutateAsync({user, payload: newPost});
  //   console.log('New post: ', post);
  //   if (post.errorMessage) {
  //     toast('Something happened while creating the post. Please try again later.');  
  //   }
  //   else {
  //     toast('New post added!');
  //     setShowCreateEditPostModal(false);
  //     setSelectedRecipes([]);
  //     setPostMessage('');
  //   }
  // };

  // const onUpdatePostSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log('Update POST: ', selectedRecipes);
  //   console.log('Update Post Message: ', postMessage);
  //   console.log('Update Post Id: ', postId);
  //   // remove unneeded fields
  //   let order = 0;
  //   let recipes = selectedRecipes.map(r => {
  //     let {post_id, id, caption, deleted} = r;
  //     if (deleted) {
  //       return {post_id, id, caption, deleted};
  //     }
  //     return {post_id, id, caption, deleted, order: order++};
  //   });
  //   let editPost = {
  //     id: postId,
  //     message: postMessage,
  //     recipes: recipes
  //   };
  //   console.log('PATCH POST ', editPost);
  //   let post = await updatePostMutation.mutateAsync({user, payload: editPost});
  //   console.log('Update post: ', post);
  //   if (post.errorMessage) {
  //     toast('Something happened while updating the post. Please try again later.');
  //   }
  //   else {
  //     setShowCreateEditPostModal(false);
  //     setPostId(null);
  //     setPostMessage('');
  //     setSelectedRecipes([]);
  //     toast('Updated post!');
  //   }
  // };

  // const onCreateEditPostClose = () => {
  //   console.log('')
  //   setShowCreateEditPostModal(false);
  //   if (postId != null) {
  //     setPostId(null);
  //     setPostMessage('');
  //   }
  //   setSelectedRecipes([]);
  // };

  // const onAddARecipe = () => {
  //   console.log('Add a recipe!');
  //   setShowSelectRecipeModal(true);
  // };

  // const onSelectRecipeSubmit = () => {
  //   setShowSelectRecipeModal(false);
  // };

  // const onSelectRecipeBack = () => {
  //   setShowSelectRecipeModal(false);
  // };

  // // TODO: Clearing selected recipes should mark them for deletion just like when manually 
  // // unchecking them. Refer to <SelectRecipeModel>.
  // const clearSelectedRecipes = () => {
  //   console.log('clear selected recipes');
  //   setSelectedRecipes([]);
  // }

  // const onAddRecipeCaption = () => {
  //   console.log('Add Recipe Caption');
  //   setShowAddRecipeCaptionModal(true);
  // }

  // const onAddRecipeCaptionDone = () => {
  //   setShowAddRecipeCaptionModal(false);
  // }

  // const onAddRecipeCaptionBack = () => {
  //   setShowAddRecipeCaptionModal(false);
  // }

  const onEditPost = (post) => {
    console.log('Edit Post: ', post);
    // setPostId(post.id);
    // setPostMessage(post.message);
    // setSelectedRecipes(JSON.parse(JSON.stringify(post.recipes)));
    // setShowCreateEditPostModal(true);
    // dispatch({ 
    //   type: 'edit_post', 
    //   postId: post.id, 
    //   postMessage: post.message, 
    //   selectedRecipes: JSON.parse(JSON.stringify(post.recipes)),
    //   showEditModal: true,
    // });
    createEditPostRef.current.onEditPost(post.id, post.message, JSON.parse(JSON.stringify(post.recipes)));
  };

  return (
    <Container fluid className='recipes-app-posts'>
      <Row>
        <Col className='left-sidebar'>
          Left
        </Col>
        <Col className='justify-content-md-center'>
          <div className='mid-content'>
          <Row className='justify-content-md-center'>
            <Col className='mb-5 mt-0'>
              {/* <CreateEditPostStateContext.Provider value={state}> */}
                <CreateEditPost ref={createEditPostRef} />
              {/* </CreateEditPostStateContext.Provider> */}
              {/* <CreatePostModalLauncher
                text='What food are you craving right now?'
                onClick={() => { 
                    setShowCreateEditPostModal(true);
                }}
                />
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
                /> */}
            </Col>
          </Row>
          <Posts onEditPost={onEditPost} />
          {children}
          </div>
        </Col>
        <Col className='right-sidebar'>
          Right
        </Col>
      </Row>
    </Container>
  );
};

export default Home;