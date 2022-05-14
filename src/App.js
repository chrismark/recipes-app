import { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import YourPosts from './components/YourPosts';
import TastyRecipes from './components/TastyRecipes';
import SavedRecipes from './components/SavedRecipes';
import ViewSavedRecipe from './components/recipe/ViewSavedRecipe';
import ListSavedRecipes from './components/recipe/ListSavedRecipes';
import './App.css';

// TODO: Create AppContext to store the user object

const App = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [fetchedValue, setFetchedValue] = useState('');
  const [posts, setPosts] = useState([]);

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
    console.log('onPostLogin');
    navigate('/', {replace: true});
  };

  const onPostRegister = (data) => {
    setUser(data);
    console.log('onPostRegister');
    navigate('/', {replace: true});
  };

  return (
    <Routes>
      <Route path='*' element={<Navigate to='/' />} />
      <Route path='/' element={<Home user={user} />} />
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
      </>) : <></>}
      <Route path='/login' element={<Login onLogin={onLogin} onPostLogin={onPostLogin} />} />
      <Route path='/register' element={<Register onRegister={onRegister} onPostRegister={onPostRegister} />} />
    </Routes>
  );
};

export default App;
