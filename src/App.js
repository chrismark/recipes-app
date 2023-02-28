import { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate, Navigate  } from 'react-router-dom';
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

// TODO: Create AppContext to store the user object

const App = () => {
  console.log('App rerender');
  const navigate = useNavigate();
  const state = useContext(AppStateContext);
  const dispatch = useContext(AppDispatchContext);

  console.log('App:', 'state=', state);

  useEffect(() => {
    (async function() {
      // Fetch posts
      
    })();
  }, [/** dependencies */]);

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
    dispatch({ type: 'update_user', user: data });
    console.log('onPostLogin');
    navigate('/');
  };

  const onPostRegister = (data) => {
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
            <MainContainer user={state.user}>
              <Home user={state.user} />
            </MainContainer>
          }>
          <Route path='posts/:post/recipes' element={<PostFullscreen user={state.user} />} />
        </Route>
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
