import React, { useState } from 'react';
import { apiService } from '../services/api.service';

export default function Login({ setSession, setAuthView }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Forgot Password States
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthSuccess('');
    try {
      const user = await apiService.loginUser(email, password);
      setSession(user);
    } catch (err) {
      setAuthErr(err.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthSuccess('');
    try {
      await apiService.resetPassword(resetEmail, newPassword);
      setAuthSuccess('Password updated successfully! You can now sign in.');
      setIsForgotMode(false);
      setEmail(resetEmail);
      setPassword('');
      setResetEmail('');
      setNewPassword('');
    } catch (err) {
      setAuthErr(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card-auth">
        <div className="brand-badge">✦ Smart Inventory Portal</div>
        <div className="auth-header">
          <h1>{isForgotMode ? 'Reset Password' : 'Welcome Back'}</h1>
          <p>{isForgotMode ? 'Enter email to create a new password' : 'Enter credentials to access portal'}</p>
        </div>

        {authSuccess && <div style={{ color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{authSuccess}</div>}

        {isForgotMode ? (
          <form onSubmit={handleResetPassword}>
            <div className="input-field-group">
              <label>Registered Email Address</label>
              <input
                className="styled-input"
                type="email"
                required
                placeholder="alex@department.edu"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  className="styled-input"
                  type={showNewPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  title={showNewPassword ? 'Hide password' : 'Show password'}
                >
                  👁
                </button>
              </div>
            </div>

            {authErr && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{authErr}</div>}

            <button className="btn-glow" type="submit">Update Password →</button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit}>
            <div className="input-field-group">
              <label>Email Address</label>
              <input
                className="styled-input"
                type="email"
                required
                placeholder="alex@department.edu"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="input-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>Password</label>
                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => { setIsForgotMode(true); setAuthErr(''); setAuthSuccess(''); }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="password-input-wrapper">
                <input
                  className="styled-input"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="eye-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  👁
                </button>
              </div>
            </div>

            {authErr && <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>{authErr}</div>}

            <button className="btn-glow" type="submit">Sign In to Portal →</button>
          </form>
        )}

        <div className="auth-switch">
          {isForgotMode ? (
            <>Remembered password?<button onClick={() => { setIsForgotMode(false); setAuthErr(''); setAuthSuccess(''); }}>← Back to Sign In</button></>
          ) : (
            <>Don't have an account?<button onClick={() => setAuthView('register')}>Register</button></>
          )}
        </div>
      </div>
    </div>
  );
}