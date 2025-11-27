// src/pages/VerifyEmail.jsx
import './AuthForm.css';

import React, { useState } from 'react';

import axios from 'axios';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();

  // get email from state, localStorage, or query (?email=)
  const queryEmail = new URLSearchParams(location.search).get('email') || '';
  const [email, setEmail] = useState(
    location.state?.email || localStorage.getItem('pendingEmail') || queryEmail || ''
  );
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Email is required.');
      return;
    }
    try {
      await axios.post('http://localhost:5000/api/auth/verify-email', { email, otp });
      localStorage.removeItem('pendingEmail');
      navigate('/signin');
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Verify Your Email</h2>
      {email ? (
        <p>We sent a 4‑digit code to <strong>{email}</strong></p>
      ) : (
        <p className="error">We need your email to verify.</p>
      )}
      {error && <p className="error">{error}</p>}

      <form className="auth-form" onSubmit={handleSubmit}>
        {!email && (
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => {
                const v = e.target.value;
                setEmail(v);
                localStorage.setItem('pendingEmail', v);
              }}
              required
            />
          </label>
        )}
        <label>
          OTP Code
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
            maxLength={4}
            inputMode="numeric"
            required
          />
        </label>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}
