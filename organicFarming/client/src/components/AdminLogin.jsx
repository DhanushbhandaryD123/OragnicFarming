import './AdminLogin.css'; // external styles

import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';

export default function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const handleSubmit = e => {
    e.preventDefault();
    if (username === 'ONLY ADMIN' && password === '1234') {
      onSuccess();
      nav('/admin', { replace: true });
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="admin-login-container">
      <form onSubmit={handleSubmit} className="admin-login-form">
        <h3>Admin Login</h3>
        {error && <p className="error-text">{error}</p>}
        <input
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
