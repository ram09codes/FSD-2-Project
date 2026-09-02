import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/api.service';

function NeoSelect({ value, onChange, options, style, placeholder = 'Select Option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value || opt === value);
  const displayLabel = selectedOption ? (typeof selectedOption === 'object' ? selectedOption.label : selectedOption) : placeholder;

  return (
    <div className="neo-select-wrapper" ref={dropdownRef} style={style}>
      <button type="button" className={`neo-select-control ${isOpen ? 'active' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span>{displayLabel}</span>
        <span className={`neo-select-arrow ${isOpen ? 'open' : ''}`}>▲</span>
      </button>

      {isOpen && (
        <div className="neo-select-dropdown">
          {options.map((opt, index) => {
            const optVal = typeof opt === 'object' ? opt.value : opt;
            const optLabel = typeof opt === 'object' ? opt.label : opt;
            const isSelected = optVal === value;

            return (
              <div
                key={index}
                className={`neo-select-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  onChange({ target: { value: optVal } });
                  setIsOpen(false);
                }}
              >
                {optLabel}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Register({ setSession, setAuthView }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [authErr, setAuthErr] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setAuthErr('');
    try {
      await apiService.registerUser({ name, email, password, role });
      const user = await apiService.loginUser(email, password);
      setSession(user);
    } catch (err) {
      setAuthErr(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card-auth">
        <div className="brand-badge">✦ Smart Inventory Portal</div>
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Fill details to register access</p>
        </div>

        <form onSubmit={handleRegisterSubmit}>
          <div className="input-field-group">
            <label>Full Name</label>
            <input
              className="styled-input"
              type="text"
              required
              placeholder="Alex Mercer"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="input-field-group">
            <label>Account Role</label>
            <NeoSelect
              value={role}
              onChange={e => setRole(e.target.value)}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' }
              ]}
            />
          </div>

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
            <label>Password</label>
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

          <button className="btn-glow" type="submit">Complete Registration →</button>
        </form>

        <div className="auth-switch">
          Already have an account?<button onClick={() => setAuthView('login')}>← Back to Sign In</button>
        </div>
      </div>
    </div>
  );
}