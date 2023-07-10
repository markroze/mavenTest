import React from 'react';

import './App.css';
import Login from './pages/Login';
import Game from './pages/Game';
export const apiUrl = 'http://localhost:3001';

const App = () => {
  const [localName, setLocalName] = React.useState<string | null>(
    localStorage.getItem('username')
  );
  return (
    <div className="App">
      {!localName ? (
        <Login {...{ setLocalName }} />
      ) : (
        <Game {...{ localName }} />
      )}
    </div>
  );
};
export default App;
