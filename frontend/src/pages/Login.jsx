import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      login(email, password);
      onNavigate('dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card-auth">
        <div className="brand-badge">✦ Smart Inventory Portal</div>
        <div className="auth-header">
          <h1>Welcome Back</h1>
          <p>Sign in to continue to Inventory Portal</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label>Email Address</label>
            <input
              type="email"
              className="styled-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
            />
          </div>
          
          <div className="input-field-group">
            <label>Password</label>
            <input
              type="password"
              className="styled-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div style={{ color: '#E62C5E', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</div>}

          <button type="submit" className="btn-glow">Sign In to Portal →</button>
        </form>

        <div className="auth-switch">
          New user?{' '}
          <button type="button" onClick={() => onNavigate('register')}>
            Register
          </button>
        </div>
      </div>
    </div>
  );
}