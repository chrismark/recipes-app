import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

const App = () => {
  const [fetchedValue, setFetchedValue] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    (async function() {
      // Fetch posts
    })();
  }, [/** dependencies */])

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
          path='/'
          element={
            <Container>
              <Header user={user} />
            </Container>
          }
        />
        <Route 
          path='/login'
          element={
            <Container>
              <Header />
              <Login onLogin={onLogin} onPostLogin={onPostLogin} />
            </Container>
          }
        />
        <Route 
          path='/register'
          element={
            <Container>
              <Header />
              <Register onRegister={onRegister} onPostRegister={onPostRegister} />
            </Container>
          }
        />
      </Routes>
  );
};

export default App;
