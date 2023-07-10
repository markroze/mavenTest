import React from 'react';

import './App.css';
import axios from 'axios';
import { apiUrl } from './App';

interface LoginProps {
  setLocalName: (name: string) => void;
}

const Login = ({ setLocalName }: LoginProps) => {
  const [username, setUsername] = React.useState<string>('');

  const handleSaveUsername = async () => {
    if (username) {
      const userRes = await await axios.post(`${apiUrl}/login`, { username });
      console.log(userRes);

      if (userRes.data) localStorage.setItem('username', userRes.data.username);
      setLocalName(username);
    }
  };
  return (
    <div className="Welcome">
      <h1>Welcome</h1>
      <input
        {...{
          type: 'text',
          placeholder: 'Enter your name',
          value: username,
          onChange: (e) => setUsername(e.target.value),
        }}
      />
      <button onClick={() => handleSaveUsername()}>Enter</button>
    </div>
  );
};

export default Login;
