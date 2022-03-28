import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Redirect, Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './components/Login';
import Register from './components/Register';
import AllPosts from './components/AllPosts';
import YourPosts from './components/YourPosts';
import TastyRecipes from './components/TastyRecipes';
import SavedRecipes from './components/SavedRecipes';
import './App.css';

const App = () => {
  const [fetchedValue, setFetchedValue] = useState('');
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

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
    navigate('/');
  };

  const onPostRegister = (data) => {
    setUser(data);
    navigate('/');
  };

  

  return (
    <Routes>
      <Route
        path='*'
        element={<Navigate to='/' />}
      />
      <Route
        index
        path='/'
        element={
          <Container fluid='sd'>
            <Header user={user} />
            <AllPosts user={user} />
            <Footer />
          </Container>
        }
      />
      {user ? (<>
      <Route
        path='/your-posts'
        element={
          <Container fluid='sd'>
            <Header user={user} />
            <YourPosts user={user} />
            <Footer />
          </Container>
        }
      />
      <Route 
        path='/tasty-recipes'
        element={
          <Container fluid='sd'>
            <Header user={user} />
            <TastyRecipes user={user} />
            <Footer />
          </Container>
        }
      />
      <Route 
        path='/saved-recipes'
        element={
          <Container fluid='sd'>
            <Header user={user} />
            <SavedRecipes user={user} />
            <Footer />
          </Container>
        }
      />
      </>) : <></>}
      <Route 
        path='/login'
        element={
          <Container fluid='sd'>
            <Header />
            <Login onLogin={onLogin} onPostLogin={onPostLogin} />
            <Footer />
          </Container>
        }
      />
      <Route 
        path='/register'
        element={
          <Container fluid='sd'>
            <Header />
            <Register onRegister={onRegister} onPostRegister={onPostRegister} />
            <Footer />
          </Container>
        }
      />
    </Routes>
  );
};

export default App;
