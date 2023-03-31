import { useState, useEffect, useContext, useRef } from 'react';
import { Route, Routes, useNavigate, Navigate, Outlet  } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import YourPosts from './components/YourPosts';
import TastyRecipes from './components/TastyRecipes';
import SavedRecipes from './components/SavedRecipes';
import ViewSavedRecipe from './components/recipe/ViewSavedRecipe';
import MainContainer from './components/MainContainer';
import PostFullscreen from './components/Post/PostFullscreen';
import { AppStateContext, AppDispatchContext } from './appContext.js';
import './App.css';
import Posts from './components/Posts';
import CreateEditPost from './components/CreateEditPost';

// TODO: Create AppContext to store the user object

const App = () => {
  console.log('App rerender');
  const createEditPostRef = useRef(null);
  const postFullscreenRef = useRef(null);
  const navigate = useNavigate();
  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  // console.log('App:', 'state=', state);

  const onLogin = async (payload) => {
    try {
      console.log('payload: ', payload);
      const result = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await result.json();
      console.log('data: ', data);
      if (data.errorMessage) {
        return [null, data.errorMessage];
      }
      return [data, null];
    }
    catch (e) {
      console.error(e);
      return [null, null];
    }
  };

  const onRegister = async (payload) => {
    try {
      console.log('payload: ', payload);
      const result = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await result.json();
      console.log('data: ', data);
      if (data.errorMessage) {
        return [null, data.errorMessage];
      }
      return [data, null];
    }
    catch (e) {
      console.error(e);
      return [null, null];
    }
  };

  const onPostLogin = (data) => {
    // TODO: Store user data inside browser cache, etc
    dispatch({ type: 'update_user', user: data });
    console.log('onPostLogin');
    navigate('/');
  };

  const onPostRegister = (data) => {
    // TODO: Store user data inside browser cache, etc
    dispatch({ type: 'update_user', user: data });
    console.log('onPostRegister');
    navigate('/');
  };

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/' />} />
      {state.user ? (<>
        <Route path='/' 
          element={
            <MainContainer user={state.user} ref={postFullscreenRef}>
              <Home user={state.user} />
            </MainContainer>
          }>
          <Route path='posts/:post/recipes' element={<PostFullscreen user={state.user} ref={postFullscreenRef} />} />
        </Route>
        <Route path='/:username/posts/:post' 
          element={
            <MainContainer user={state.user}>
              <Home user={state.user} />
            </MainContainer>
          }>
          <Route path='/:username/posts/:post/recipes' element={<PostFullscreen user={state.user} />} />
        </Route>
        {/* 
        TODO: Add path=':username/posts/:post/recipes element={<SinglePost />}
        <SinglePost> will display the post on its own page
        */}
        <Route path='/saved-recipes' 
          element={
            <MainContainer user={state.user}>
              <SavedRecipes user={state.user} />
            </MainContainer>
          }>
          <Route path=':recipe' element={<ViewSavedRecipe user={state.user} />} />
        </Route>
        <Route element={<MainContainer user={state.user} />}>
          <Route path='/your-posts' element={<YourPosts user={state.user} />} />
          <Route path='/tasty-recipes' element={<TastyRecipes user={state.user} />} />
          <Route path='/recipes' element={<></>}>
            <Route index element={<Navigate to='/tasty-recipes' />} />
          </Route>
        </Route>
      </>) : <>
        <Route exact path='/' element={<MainContainer user={state.user} />}>
          <Route exact path='/login' 
            element={<Login onLogin={onLogin} onPostLogin={onPostLogin} />} />
          <Route exact path='/register' 
            element={<Register onRegister={onRegister} onPostRegister={onPostRegister} />} />
        </Route>
      </>}
    </Routes>
  );
};

export default App;
