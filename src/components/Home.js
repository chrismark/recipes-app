import { useEffect, useState, useContext, useRef, useReducer } from 'react';
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
  const { toast } = useStore();

  useEffect(() => {
    console.log('Home MOUNTED');
    return () => console.log('Home UNMOUNTED');
  }, []);

  const onEditPost = (post) => {
    console.log('Edit Post: ', post);
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
          <CreateEditPost ref={createEditPostRef} />
          <Posts onEditPost={onEditPost} />
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