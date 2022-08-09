import { useState, useEffect } from 'react';
import { Form, Container, Row, Col, Card } from 'react-bootstrap';
import Paginate from './Paginate';
import CreatePostModal from './CreatePostModal';
import SelectRecipeModal from './SelectRecipeModal';
import AddRecipeCaptionModal from './AddRecipeCaptionModal';
import { FaLongArrowAltRight } from 'react-icons/fa';

const Posts = ({ user, byUser = false }) => {
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pageOffset, setPageOffset] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [showSelectRecipeModal, setShowSelectRecipeModal] = useState(false);
  const [showAddRecipeCaptionModal, setShowAddRecipeCaptionModal] = useState(false);
  const size = 20;
  const postCount = 300;

  useEffect(() => {
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

  const getPosts = async() => {
    if (byUser) {
      // Fetch posts
      await fetchUserPosts(user);
    }
    else {
      await fetchAllPosts(user);
    }
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

  const fetchUserPosts = async ({id, token}) => {
    try {
      const result = await fetch(`/api/users/${id}/posts`, {
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
      const result = await fetch(`/api/users/${user.id}/posts`, {
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

  const onCreatePostSubmit = () => {

  };

  const onCreatePostClose = () => {
    setShowCreatePostModal(false);
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

  return (
    <Container fluid className='recipes-app-posts'>
      {user && (
      <Row className='justify-content-md-center'>
        <Col xs='6' className='m-5'>
          <Form>
            <Form.Control
              readOnly={true}
              value={"What food are you craving right now? TODO: onhover change lighter color"}
              className='cursor-pointer'
              onClick={() => { 
                console.log('setShowCreatePostModal to true'); 
                setShowCreatePostModal(true);
              }}
              />
          </Form>
        </Col>
      </Row>
      )}
      <Row xs={1} sm={2} md={2} lg={3} xl={4} xxl={4} className='gy-4'>
        {posts.map((post) => (
          <Col key={post.id}>
            <Card>
              <Card.Body>
                <span className='h2'>{post.id}</span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {posts.length > 0 && (<>
        <br/><br/>
        <Paginate totalCount={postCount} pageOffset={pageOffset} size={size} dataSource={posts} onPage={getPage} />
      </>)}
      {user && (
      <>
        <CreatePostModal 
          show={showCreatePostModal} 
          onSubmit={onCreatePostSubmit} 
          onAddARecipe={onAddARecipe} 
          onEditCaption={onAddRecipeCaption}
          onClose={onCreatePostClose} 
          selectedRecipes={selectedRecipes}
          setSelectedRecipes={setSelectedRecipes}
          clearSelectedRecipes={clearSelectedRecipes} 
          />
        <SelectRecipeModal 
          user={user} 
          show={showSelectRecipeModal} 
          onSelect={onSelectRecipeSubmit} 
          onClose={onSelectRecipeBack} 
          selectedRecipes={selectedRecipes} 
          setSelectedRecipes={setSelectedRecipes} 
          />
        <AddRecipeCaptionModal
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

export default Posts;