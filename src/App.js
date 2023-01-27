import { useState, useEffect, useContext } from 'react';
import { Route, Routes, useNavigate, Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import YourPosts from './components/YourPosts';
import TastyRecipes from './components/TastyRecipes';
import SavedRecipes from './components/SavedRecipes';
import ViewSavedRecipe from './components/recipe/ViewSavedRecipe';
import ListSavedRecipes from './components/recipe/ListSavedRecipes';
import MainContainer from './components/MainContainer';
import PostFullscreen from './components/Post/PostFullscreen';
import { AppContext } from './appContext.js';
import './App.css';

// TODO: Create AppContext to store the user object

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fetchedValue, setFetchedValue] = useState('');
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useContext(AppContext);

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
    setUser(data);
    setCurrentUser(data);
    console.log('onPostLogin');
    navigate('/');
  };

  const onPostRegister = (data) => {
    setUser(data);
    setCurrentUser(data);
    console.log('onPostRegister');
    navigate('/');
  };

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/' />} />
      <Route exact path='/' element={<MainContainer user={user} />}>
        <Route index element={<Home user={user} />} />
        {user ? (<>
          <Route path='/your-posts' element={<YourPosts user={user} />} />
          <Route path='/tasty-recipes' element={<TastyRecipes user={user} />} />
          <Route path='/saved-recipes' element={<SavedRecipes user={user} />}>
            <Route index element={<ListSavedRecipes />} />
            <Route path=':recipe' element={<ViewSavedRecipe user={user} />} />
          </Route>
          <Route path='/recipes' element={<></>}>
            <Route index element={<Navigate to='/tasty-recipes' />} />
          </Route>
          <Route path='/posts' element={<Outlet />}>
            <Route path=':post/recipes' element={<PostFullscreen user={user} />} />
          </Route>
        </>) : <></>}
        <Route exact path='/login' element={<Login onLogin={onLogin} onPostLogin={onPostLogin} />} />
        <Route exact path='/register' element={<Register onRegister={onRegister} onPostRegister={onPostRegister} />} />
      </Route>
    </Routes>
  );
};

export default App;
