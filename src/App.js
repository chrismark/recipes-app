import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [fetchedValue, setFetchedValue] = useState('');

  useEffect(() => {
    (async function() {
      const val = await fetchApiHello();
      console.log('fetched value: ', val);
      setFetchedValue(JSON.stringify(val));
    })();
  }, [/** dependencies */])

  // Fetch value from /api/hello
  const fetchApiHello = async () => {
    const res = await fetch('/api/hello');
    return await res.json();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>Fetched on load: {fetchedValue}.</p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
