import './AuthForm.css';

import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = ({ onLogin }) => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
         
            const { data } = await axios.post(
                'http://localhost:5000/api/auth/signin',
                { email: form.email, password: form.password }
            );
            // data.user = { id, username, email }
            onLogin(data.user);
            navigate('/');         // redirect to home
        } catch (err) {
            setError(err.response?.data?.message || 'Signin failed');
        }
    };

    return (
        <div className="auth-form-container">
            <h2>Sign In</h2>
            {error && <p className="error">{error}</p>}
            <form className="auth-form" onSubmit={handleSubmit}>

                <label>
                    Email
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
