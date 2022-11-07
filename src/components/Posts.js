import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import Paginate from './Paginate';
import CreateEditPostModal from './CreateEditPostModal';
import SelectRecipeModal from './SelectRecipeModal';
import AddRecipeCaptionModal from './AddRecipeCaptionModal';
import { FaLongArrowAltRight } from 'react-icons/fa';
import { toast } from './Toaster';
import Post from './Post/Post';
import PostPlaceholder from './Post/PostPlaceholder';
import CreatePostModalLauncher from './CreateEditPostModalLauncher';

const Posts = ({ user, byUser }) => {
  console.log('Posts:', user);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [postId, setPostId] = useState(null);
  const [postMessage, setPostMessage] = useState('');
  const [posts, setPosts] = useState([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showCreateEditPostModal, setShowCreateEditPostModal] = useState(false);
  const [showSelectRecipeModal, setShowSelectRecipeModal] = useState(false);
  const [showAddRecipeCaptionModal, setShowAddRecipeCaptionModal] = useState(false);
  const [postsByUser, setPostsByUser] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const size = 20;
  const postCount = 300;

  useEffect(() => {
    console.log('fetch Posts: run when pageOffset changes');
    if (user) {
      getPosts();
    }
  }, [pageOffset]);

  const getPage = (page) => {
    page = parseInt(page);
    if (isNaN(page) || page < 1) {
      page = 1;
    }
    setPageOffset((page - 1) * size);
  };

  const getPosts = async () => {
    console.log('getPosts: byUser=', postsByUser);
    setIsFetching(true);
    if (postsByUser) {
      // Fetch posts
      await fetchUserPosts(user);
    }
    else {
      await fetchAllPosts(user);
    }
    setIsFetching(false);
  };

  const fetchAllPosts = async({token}) => {
    try {
      const result = await fetch(`/api/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      let data = await result.json();
      // TODO: Remove after testing
      // Fill up posts with dummy objects
      data = [];
      for (let i = pageOffset, m = i + size; i < m && i < postCount; i++) {
        data.push({id: i});
      }
      console.log('posts: ', data);
      setPosts(data);
    }
    catch (e) {
      console.error(e);
    }
  };

  const fetchUserPosts = async ({uuid, token}) => {
    try {
      const result = await fetch(`/api/users/${uuid}/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const posts = await result.json();
      setPosts(posts);
    }
    catch (e) {
      console.error(e);
    }
  };

  const createPost = async (payload) => {
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

  const updatePost = async (postId, payload) => {
    try {
      const result = await fetch(`/api/users/${user.uuid}/posts/${postId}`, {
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
    let post = await createPost(newPost);
    console.log('New post: ', post);
    toast('New post added!');
    setShowCreateEditPostModal(false);
    setSelectedRecipes([]);
    setPostMessage('');
    setPosts([post, ...posts]);

    // TODO: Do something if it fails
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
        message: postMessage,
        recipes: recipes
      };
      console.log('PATCH POST ', editPost);
      let post = await updatePost(postId, editPost);
      console.log('Update post: ', post);
      // find and update post
      let index = posts.findIndex(p => p.id == postId);
      posts[index].message = post.message;
      posts[index].recipes = post.recipes;
      setShowCreateEditPostModal(false);
      setPostId(null);
      setPostMessage('');
      setSelectedRecipes([]);
      setPosts([...posts]);
      
      toast('Updated post!');
      // TODO: Do something if it fails
    }
    catch (e) {
      console.log('Error updating: ', e);
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
        <Col xs={3} className='left-sidebar bg-secondary'>
          Left
        </Col>
        <Col className='mid-content justify-content-md-center'>
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
            {isFetching && (<>
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
            {posts.map(post => (
              <Col className='justify-content-md-center' key={post.id}>
                <Post user={user} post={post} onEditPost={onEditPost} />
              </Col>
            ))}
          </Row>
          {posts.length > 0 && (<>
            <br/><br/>
            <Paginate totalCount={postCount} pageOffset={pageOffset} size={size} dataSource={posts} onPage={getPage} />
          </>)}
        </Col>
        <Col xs={3} className='right-sidebar bg-info'>
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