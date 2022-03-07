import { useState, useEffect } from 'react';
import { Link, BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { Row, Container } from 'react-bootstrap';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';
import './App.css';

function App() {
  const [fetchedValue, setFetchedValue] = useState('');

  useEffect(() => {
    (async function() {
      //const val = await fetchApiHello();
      //console.log('fetched value: ', val);
      //setFetchedValue(JSON.stringify(val));
    })();
  }, [/** dependencies */])

  // Fetch value from /api/hello
  const fetchApiHello = async () => {
    const res = await fetch('/api/hello');
    return await res.json();
  }

  return (
    <Router>
      <Routes>
        <Route
          path='/'
          element={
            <Container>
              <Header />
              
            </Container>
          }
        />
        <Route 
          path='/login'
          element={
            <Container>
              <Header />
              <Login />
            </Container>
          }
        />
        <Route 
          path='/register'
          element={
            <Container>
              <Header />
              <Register />
            </Container>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
