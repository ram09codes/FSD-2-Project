import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Register({ onNavigate }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      register({ name, email, password, role });
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
          <h1>Create Account</h1>
          <p>Register to manage inventory records</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-field-group">
            <label>Full Name</label>
            <input
              type="text"
              className="styled-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="John Doe"
            />
          </div>

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

          <div className="input-field-group">
            <label>Role</label>
            <select
              className="styled-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="User" style={{ background: '#0A2947' }}>User</option>
              <option value="Admin" style={{ background: '#0A2947' }}>Admin</option>
            </select>
          </div>

          {error && <div style={{ color: '#E62C5E', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{error}</div>}

          <button type="submit" className="btn-glow">Complete Registration →</button>
        </form>

        <div className="auth-switch">
          Already have an account?{' '}
          <button type="button" onClick={() => onNavigate('login')}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}