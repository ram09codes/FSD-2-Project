import React, { useState, useRef, useEffect } from 'react';
import { apiService } from './services/api.service';

// ==========================================
// 1. NEOMORPHIC STYLES INJECTOR
// ==========================================
const inlineStyles = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --neo-bg: #0A2947;
  --neo-accent: #E62C5E;
  --neo-accent-glow: rgba(230, 44, 94, 0.4);
  --text-main: #F1F5F9;
  --text-muted: #88A2BC;
  
  --neo-shadow-flat: 8px 8px 18px #05182a, -8px -8px 18px #0f3a64;
  --neo-shadow-btn: 5px 5px 12px #051627, -5px -5px 12px #0f3c67;
  --neo-shadow-btn-hover: 7px 7px 16px #041322, -7px -7px 16px #103f6c;
  --neo-shadow-inset: inset 4px 4px 8px #051627, inset -4px -4px 8px #0f3c67;
  --neo-shadow-accent-pressed: inset 3px 3px 6px rgba(0, 0, 0, 0.4), inset -3px -3px 6px rgba(255, 255, 255, 0.2);
}

* { 
  margin: 0; 
  padding: 0; 
  box-sizing: border-box; 
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; 
}

html, body, #root { 
  width: 100vw; 
  height: 100vh; 
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden; 
  background-color: var(--neo-bg); 
  color: var(--text-main); 
}

/* Ambient Glow Orbs */
.orb { position: fixed; border-radius: 50%; filter: blur(140px); z-index: 0; pointer-events: none; }
.orb-1 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(230, 44, 94, 0.15) 0%, transparent 70%); top: -100px; left: -100px; }
.orb-2 { width: 350px; height: 350px; background: radial-gradient(circle, rgba(14, 56, 96, 0.6) 0%, transparent 70%); bottom: -80px; right: -80px; }

/* Auth Layout Fit Screen */
.auth-wrapper { 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  width: 100vw; 
  height: 100vh; 
  z-index: 1; 
  padding: 1rem; 
  overflow: hidden;
}

.glass-card-auth { 
  background: var(--neo-bg); 
  border-radius: 24px; 
  padding: 2.2rem; 
  width: 100%; 
  max-width: 420px; 
  max-height: 95vh;
  box-shadow: var(--neo-shadow-flat);
  border: 1px solid rgba(255, 255, 255, 0.03);
  overflow-y: auto;
  margin: auto;
}

.brand-badge { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.4rem; 
  font-size: 0.7rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  color: var(--neo-accent); 
  background: var(--neo-bg); 
  padding: 0.45rem 0.9rem; 
  border-radius: 20px; 
  box-shadow: var(--neo-shadow-btn);
  margin-bottom: 1.2rem; 
}

.auth-header h1 { font-size: 1.5rem; font-weight: 800; color: #FFFFFF; }
.auth-header p { color: var(--text-muted); font-size: 0.825rem; margin-bottom: 1.25rem; }

.input-field-group { margin-bottom: 1rem; position: relative; }
.input-field-group label { display: block; font-size: 0.725rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.4rem; }

/* Neomorphic Inset Input Fields */
.styled-input { 
  width: 100%; 
  padding: 0.7rem 1rem; 
  background: var(--neo-bg); 
  border: none;
  border-radius: 14px; 
  color: var(--text-main); 
  font-size: 0.85rem; 
  font-weight: 600;
  outline: none; 
  box-shadow: var(--neo-shadow-inset);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.styled-input:focus { 
  box-shadow: inset 5px 5px 9px #041220, inset -5px -5px 9px #10406e, 0 0 10px var(--neo-accent-glow);
}

/* =========================================================
   CUSTOM NEOMORPHIC FLOATING DROPDOWN COMPONENT STYLES
   ========================================================= */
.neo-select-wrapper { position: relative; width: 100%; }

.neo-select-control {
  width: 100%;
  padding: 0.7rem 1rem;
  background: var(--neo-bg);
  border: none;
  border-radius: 14px;
  color: var(--text-main);
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: var(--neo-shadow-inset);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.neo-select-control.active,
.neo-select-control:focus {
  outline: none;
  box-shadow: inset 5px 5px 9px #041220, inset -5px -5px 9px #10406e, 0 0 10px var(--neo-accent-glow);
}

.neo-select-arrow {
  color: var(--neo-accent);
  font-size: 0.8rem;
  transition: transform 0.25s ease;
}

.neo-select-arrow.open {
  transform: rotate(180deg);
}

/* Floating Raised Dropdown Menu (Matches image_434fe6.png) */
.neo-select-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--neo-bg);
  border-radius: 18px;
  padding: 0.6rem;
  z-index: 1000;
  box-shadow: 10px 10px 24px #041220, -6px -6px 18px #0f3c67;
  border: 1px solid rgba(255, 255, 255, 0.04);
  max-height: 220px;
  overflow-y: auto;
  animation: neoDropdownFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes neoDropdownFade {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.neo-select-option {
  padding: 0.7rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 4px;
}

.neo-select-option:last-child { margin-bottom: 0; }

.neo-select-option:hover {
  background: var(--neo-bg);
  color: #FFFFFF;
  box-shadow: var(--neo-shadow-btn);
  transform: translateX(4px);
}

.neo-select-option.selected {
  color: var(--neo-accent);
  background: var(--neo-bg);
  box-shadow: var(--neo-shadow-inset);
  font-weight: 700;
}

/* Password Input */
.password-input-wrapper { position: relative; display: flex; align-items: center; }
.password-input-wrapper .styled-input { padding-right: 2.5rem; }
.eye-toggle-btn { position: absolute; right: 0.6rem; background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 0.2rem; }

.forgot-link-btn { background: none; border: none; color: var(--neo-accent); font-size: 0.75rem; font-weight: 600; cursor: pointer; }
.forgot-link-btn:hover { text-decoration: underline; }

/* Buttons */
.btn-glow { 
  width: 100%; 
  padding: 0.75rem 1.25rem; 
  background: var(--neo-accent); 
  border: none; 
  border-radius: 14px; 
  color: #FFFFFF; 
  font-weight: 700; 
  font-size: 0.875rem; 
  cursor: pointer; 
  margin-top: 0.5rem; 
  box-shadow: 4px 4px 12px #051627, -2px -2px 10px rgba(255, 255, 255, 0.1), 0 4px 15px var(--neo-accent-glow);
  transition: all 0.15s ease-in-out;
}

.btn-glow:hover {
  transform: translateY(-2px);
  box-shadow: 6px 6px 16px #041220, -2px -2px 12px rgba(255, 255, 255, 0.15), 0 6px 20px var(--neo-accent-glow);
}

.btn-glow:active {
  transform: translateY(1px);
  box-shadow: var(--neo-shadow-accent-pressed);
}

.auth-switch { text-align: center; margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted); }
.auth-switch button { background: none; border: none; color: var(--neo-accent); font-weight: 700; cursor: pointer; margin-left: 0.3rem; text-decoration: underline; }

/* Main Shell Structure Fit Screen */
.app-shell { 
  display: flex; 
  width: 100vw; 
  height: 100vh; 
  max-width: 100vw;
  max-height: 100vh;
  z-index: 1; 
  overflow: hidden; 
}

.glass-sidebar { 
  width: 250px; 
  min-width: 250px; 
  height: 100vh; 
  background: var(--neo-bg); 
  border-right: 1px solid rgba(255, 255, 255, 0.03); 
  padding: 1.25rem 1rem; 
  display: flex; 
  flex-direction: column; 
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.15);
}

.sidebar-logo { display: flex; align-items: center; gap: 0.65rem; margin-bottom: 1.5rem; }
.logo-icon { 
  width: 32px; 
  height: 32px; 
  background: var(--neo-accent); 
  border-radius: 10px; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  font-size: 0.9rem; 
  color: #FFF;
  box-shadow: 0 4px 12px var(--neo-accent-glow);
}
.sidebar-logo span { font-size: 0.78rem; font-weight: 800; color: #FFFFFF; letter-spacing: 0.5px; }

.nav-link { 
  display: flex; 
  align-items: center; 
  gap: 0.75rem; 
  padding: 0.7rem 0.95rem; 
  color: var(--text-muted); 
  border-radius: 12px; 
  font-weight: 600; 
  font-size: 0.85rem; 
  cursor: pointer;
  transition: all 0.2s ease;
}
.nav-link.active { 
  background: var(--neo-bg); 
  color: var(--neo-accent); 
  box-shadow: var(--neo-shadow-inset);
  font-weight: 700;
}

.user-profile-badge { 
  margin-top: auto; 
  background: var(--neo-bg); 
  border-radius: 16px; 
  padding: 0.85rem; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  box-shadow: var(--neo-shadow-flat);
}

.logout-btn { 
  background: var(--neo-bg); 
  border: none; 
  color: var(--neo-accent); 
  padding: 0.4rem 0.8rem; 
  border-radius: 10px; 
  font-size: 0.75rem; 
  font-weight: 700; 
  cursor: pointer; 
  box-shadow: var(--neo-shadow-btn);
  transition: all 0.15s ease;
}
.logout-btn:hover { box-shadow: var(--neo-shadow-btn-hover); transform: translateY(-1px); }
.logout-btn:active { box-shadow: var(--neo-shadow-inset); transform: translateY(1px); }

.main-workspace { 
  flex: 1; 
  height: 100vh; 
  max-height: 100vh;
  padding: 1.25rem 1.75rem; 
  display: flex; 
  flex-direction: column; 
  overflow: hidden; 
}

.top-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-shrink: 0; }
.top-bar h2 { font-size: 1.35rem; font-weight: 800; color: #FFFFFF; }
.top-bar p { color: var(--text-muted); font-size: 0.78rem; margin-top: 0.15rem; }

.btn-glow-compact { 
  width: auto !important; 
  display: inline-flex !important; 
  align-items: center !important; 
  justify-content: center !important; 
  padding: 0.55rem 1.1rem !important; 
  background: var(--neo-accent) !important; 
  border: none !important; 
  border-radius: 12px !important; 
  color: #ffffff !important; 
  font-weight: 700 !important; 
  font-size: 0.8rem !important; 
  cursor: pointer !important; 
  box-shadow: 4px 4px 10px #051627, -2px -2px 8px rgba(255, 255, 255, 0.1), 0 4px 12px var(--neo-accent-glow) !important;
  transition: all 0.15s ease-in-out !important;
}

.btn-glow-compact:hover {
  transform: translateY(-2px) !important;
  box-shadow: 6px 6px 14px #041220, -2px -2px 10px rgba(255, 255, 255, 0.15), 0 6px 16px var(--neo-accent-glow) !important;
}
.btn-glow-compact:active {
  transform: translateY(1px) !important;
  box-shadow: var(--neo-shadow-accent-pressed) !important;
}

.btn-glow-compact-sec { 
  width: auto !important; 
  display: inline-flex !important; 
  align-items: center !important; 
  justify-content: center !important; 
  padding: 0.55rem 1rem !important; 
  background: var(--neo-bg) !important; 
  border: none !important; 
  border-radius: 12px !important; 
  color: var(--text-main) !important; 
  font-weight: 600 !important; 
  font-size: 0.8rem !important; 
  cursor: pointer !important; 
  box-shadow: var(--neo-shadow-btn) !important;
  transition: all 0.15s ease-in-out !important;
}
.btn-glow-compact-sec:hover {
  box-shadow: var(--neo-shadow-btn-hover) !important;
  transform: translateY(-2px) !important;
}
.btn-glow-compact-sec:active {
  box-shadow: var(--neo-shadow-inset) !important;
  transform: translateY(1px) !important;
}

.metrics-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1rem; flex-shrink: 0; }
.metric-card { 
  background: var(--neo-bg); 
  border-radius: 16px; 
  padding: 0.85rem 1.1rem; 
  position: relative; 
  box-shadow: var(--neo-shadow-flat);
}
.metric-card::before { 
  content: ''; 
  position: absolute; 
  top: 0; 
  left: 15%; 
  width: 70%; 
  height: 3px; 
  background: var(--neo-accent); 
  border-radius: 3px;
}
.metric-label { font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); }
.metric-val { font-size: 1.4rem; font-weight: 800; margin-top: 0.2rem; color: #FFFFFF; }

.glass-panel { 
  background: var(--neo-bg); 
  border-radius: 20px; 
  padding: 1.1rem 1.35rem; 
  display: flex; 
  flex-direction: column; 
  flex: 1; 
  min-height: 0; 
  overflow: hidden; 
  box-shadow: var(--neo-shadow-flat);
}

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; flex-shrink: 0; }

.glass-table-wrapper { flex: 1; overflow-y: auto; min-height: 0; }
.glass-table { width: 100%; border-collapse: separate; border-spacing: 0 10px; text-align: left; }
.glass-table th { 
  position: sticky; 
  top: 0; 
  background: var(--neo-bg); 
  padding: 0.6rem 0.9rem; 
  color: var(--text-muted); 
  font-size: 0.68rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  z-index: 10; 
}

.glass-table tbody tr { 
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
  opacity: 0.9;
}

.glass-table tbody tr td { 
  padding: 0.75rem 0.9rem; 
  font-size: 0.825rem; 
  white-space: nowrap; 
  background-color: var(--neo-bg);
  box-shadow: var(--neo-shadow-btn);
}

.glass-table tbody tr td:first-child { border-top-left-radius: 14px; border-bottom-left-radius: 14px; }
.glass-table tbody tr td:last-child { border-top-right-radius: 14px; border-bottom-right-radius: 14px; }

.glass-table tbody tr:hover { opacity: 1 !important; transform: translate3d(0, -4px, 0); }
.glass-table tbody tr:hover td { box-shadow: var(--neo-shadow-btn-hover); }

.status-pill { display: inline-flex; align-items: center; gap: 0.35rem; padding: 0.25rem 0.65rem; border-radius: 20px; font-size: 0.7rem; font-weight: 700; box-shadow: var(--neo-shadow-inset); }
.status-pill.available { color: #34D399; }
.status-pill.low { color: #FBBF24; }
.status-pill.out { color: var(--neo-accent); }

.btn-action-view { background: var(--neo-bg); border: none; color: #818CF8; padding: 0.35rem 0.75rem; border-radius: 10px; font-size: 0.75rem; font-weight: 600; cursor: pointer; box-shadow: var(--neo-shadow-btn); transition: all 0.15s ease; }
.btn-action-edit { background: var(--neo-bg); border: none; color: #FBBF24; padding: 0.35rem 0.75rem; border-radius: 10px; font-size: 0.75rem; font-weight: 600; cursor: pointer; box-shadow: var(--neo-shadow-btn); transition: all 0.15s ease; }
.btn-action-delete { background: var(--neo-bg); border: none; color: var(--neo-accent); padding: 0.35rem 0.75rem; border-radius: 10px; font-size: 0.75rem; font-weight: 700; cursor: pointer; box-shadow: var(--neo-shadow-btn); transition: all 0.15s ease; }

.btn-action-view:hover, .btn-action-edit:hover, .btn-action-delete:hover { transform: translateY(-1px); box-shadow: var(--neo-shadow-btn-hover); }
.btn-action-view:active, .btn-action-edit:active, .btn-action-delete:active { box-shadow: var(--neo-shadow-inset); transform: translateY(1px); }

.pagination-bar { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0.5rem 0 0.5rem; margin-top: auto; font-size: 0.78rem; color: var(--text-muted); flex-shrink: 0; }
.pagination-controls { display: flex; align-items: center; gap: 0.6rem; }
.page-btn { background: var(--neo-bg); border: none; color: var(--text-main); padding: 0.4rem 0.85rem; border-radius: 10px; font-size: 0.78rem; font-weight: 600; cursor: pointer; box-shadow: var(--neo-shadow-btn); transition: all 0.15s ease; }
.page-btn:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; }
.page-btn:not(:disabled):hover { transform: translateY(-1px); box-shadow: var(--neo-shadow-btn-hover); }
.page-btn:not(:disabled):active { transform: translateY(1px); box-shadow: var(--neo-shadow-inset); }

.page-num { font-weight: 700; color: var(--text-main); padding: 0.3rem 0.7rem; background: var(--neo-bg); border-radius: 10px; font-size: 0.75rem; box-shadow: var(--neo-shadow-inset); }

/* Modal Neomorphic Overlays & Controls */
.modal-overlay { 
  position: fixed; 
  top: 0; 
  left: 0; 
  width: 100vw; 
  height: 100vh; 
  background: rgba(5, 20, 36, 0.75); 
  backdrop-filter: blur(8px); 
  display: flex; 
  justify-content: center; 
  align-items: center; 
  z-index: 100; 
}

.glass-modal { 
  background: var(--neo-bg); 
  border-radius: 24px; 
  padding: 2rem; 
  width: 100%; 
  max-width: 440px; 
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--neo-shadow-flat); 
  border: 1px solid rgba(255, 255, 255, 0.03); 
}

.modal-footer { 
  display: flex; 
  justify-content: flex-end; 
  gap: 0.75rem; 
  margin-top: 1.4rem; 
}

.modal-footer .styled-input[style*="width: auto"],
.modal-footer button:not(.btn-glow-compact):not(.btn-action-delete) {
  width: auto !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0.55rem 1.1rem !important;
  background: var(--neo-bg) !important;
  border: none !important;
  border-radius: 12px !important;
  color: var(--text-muted) !important;
  font-weight: 700 !important;
  font-size: 0.825rem !important;
  cursor: pointer !important;
  box-shadow: var(--neo-shadow-btn) !important;
  transition: all 0.15s ease-in-out !important;
}

.modal-footer .styled-input[style*="width: auto"]:hover,
.modal-footer button:not(.btn-glow-compact):not(.btn-action-delete):hover {
  color: var(--text-main) !important;
  transform: translateY(-2px) !important;
  box-shadow: var(--neo-shadow-btn-hover) !important;
}

.modal-footer .styled-input[style*="width: auto"]:active,
.modal-footer button:not(.btn-glow-compact):not(.btn-action-delete):active {
  transform: translateY(1px) !important;
  box-shadow: var(--neo-shadow-inset) !important;
}

/* Custom Neomorphic Scrollbar Styling for Dropdown List & Tables */
.neo-select-dropdown::-webkit-scrollbar,
.glass-table-wrapper::-webkit-scrollbar,
.glass-card-auth::-webkit-scrollbar,
.glass-modal::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.neo-select-dropdown::-webkit-scrollbar-track,
.glass-table-wrapper::-webkit-scrollbar-track,
.glass-card-auth::-webkit-scrollbar-track,
.glass-modal::-webkit-scrollbar-track {
  background: #051829;
  border-radius: 10px;
}

.neo-select-dropdown::-webkit-scrollbar-thumb,
.glass-table-wrapper::-webkit-scrollbar-thumb,
.glass-card-auth::-webkit-scrollbar-thumb,
.glass-modal::-webkit-scrollbar-thumb {
  background: #0f3c67;
  border-radius: 10px;
  box-shadow: var(--neo-shadow-btn);
}

.neo-select-dropdown::-webkit-scrollbar-thumb:hover,
.glass-table-wrapper::-webkit-scrollbar-thumb:hover {
  background: var(--neo-accent);
}
`;

// ==========================================
// 2. REUSABLE NEOMORPHIC DROPDOWN COMPONENT
// ==========================================
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

  const selectedOption = options.find((opt) => opt.value === value || opt === value || opt.categoryName === value);
  let displayLabel = placeholder;
  
  if (selectedOption) {
    if (typeof selectedOption === 'object') {
      displayLabel = selectedOption.label || selectedOption.categoryName || selectedOption.value;
    } else {
      displayLabel = selectedOption;
    }
  }

  return (
    <div className="neo-select-wrapper" ref={dropdownRef} style={style}>
      <button
        type="button"
        className={`neo-select-control ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayLabel}</span>
        <span className={`neo-select-arrow ${isOpen ? 'open' : ''}`}>▲</span>
      </button>

      {isOpen && (
        <div className="neo-select-dropdown">
          {options.map((opt, index) => {
            const optVal = typeof opt === 'object' ? (opt.categoryName || opt.value) : opt;
            const optLabel = typeof opt === 'object' ? (opt.label || opt.categoryName || opt.value) : opt;
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

// ==========================================
// 3. MAIN APPLICATION CODE
// ==========================================
export default function App() {
  const [session, setSession] = useState(() => apiService.getCurrentSession());
  const [authView, setAuthView] = useState('login');
  
  // Auth Controls
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [authErr, setAuthErr] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');

  // Reset Password Fields
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Main Data States
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal Dialog Controls
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingStockItem, setEditingStockItem] = useState(null);
  const [newStockQty, setNewStockQty] = useState('');

  // Form Fields
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Pagination Controls
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (session) {
      fetchPortalData();
    } else {
      setInventory([]);
      setCategories([]);
    }
  }, [session]);

  const fetchPortalData = async () => {
    try {
      const [invData, catData] = await Promise.all([
        apiService.getInventory(),
        apiService.getCategories()
      ]);
      setInventory(invData);
      setCategories(catData);
    } catch (err) {
      console.error('Error fetching data from MongoDB:', err);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthErr('');
    setAuthSuccess('');

    try {
      if (authView === 'login') {
        const user = await apiService.loginUser(email, password);
        setSession(user);
      } else if (authView === 'register') {
        await apiService.registerUser({ name, email, password, role });
        const user = await apiService.loginUser(email, password);
        setSession(user);
      }
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
      setAuthView('login');
      setEmail(resetEmail);
      setPassword('');
      setResetEmail('');
      setNewPassword('');
    } catch (err) {
      setAuthErr(err.message);
    }
  };

  const handleLogout = () => {
    apiService.logout();
    setSession(null);
  };

  // Inventory Operations Handlers
  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiService.addInventoryItem({ productName, category, quantity, unitPrice, supplierName });
      setInventory(updated);
      setIsAddModalOpen(false);
      setProductName(''); setQuantity(''); setUnitPrice(''); setSupplierName('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUpdateStock = async (e) => {
    e.preventDefault();
    if (editingStockItem) {
      try {
        const updated = await apiService.updateStock(editingStockItem._id, newStockQty);
        setInventory(updated);
        setEditingStockItem(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        const updated = await apiService.deleteInventoryItem(itemToDelete._id);
        setInventory(updated);
        setItemToDelete(null);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiService.addCategory(catName, catDesc);
      setCategories(updated);
      setCatName(''); setCatDesc('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteCategory = async (catId) => {
    try {
      const updated = await apiService.deleteCategory(catId);
      setCategories(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const updated = await apiService.updateProfile(session.name);
      setSession(updated);
      setIsProfileModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  // Computations
  const filteredList = inventory.filter(i => {
    const matchesSearch = i.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          i.supplierName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || i.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const totalPages = Math.ceil(filteredList.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const totalProducts = inventory.length;
  const lowStockProducts = inventory.filter(i => i.quantity > 0 && i.quantity <= 10).length;
  const outOfStockProducts = inventory.filter(i => i.quantity === 0).length;
  const totalValuation = inventory.reduce((acc, curr) => acc + (curr.quantity * curr.unitPrice), 0);

  return (
    <>
      <style>{inlineStyles}</style>

      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>

      {!session ? (
        <div className="auth-wrapper">
          <div className="glass-card-auth">
            <div className="brand-badge">✦ Smart Inventory Portal</div>
            <div className="auth-header">
              <h1>
                {authView === 'login' && 'Welcome Back'}
                {authView === 'register' && 'Create Account'}
                {authView === 'forgot' && 'Reset Password'}
              </h1>
              <p>
                {authView === 'login' && 'Enter credentials to access portal'}
                {authView === 'register' && 'Fill details to register access'}
                {authView === 'forgot' && 'Enter email to create a new password'}
              </p>
            </div>

            {authSuccess && <div style={{ color: '#34d399', fontSize: '0.85rem', marginBottom: '1rem', textAlign: 'center' }}>{authSuccess}</div>}

            {authView === 'forgot' ? (
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
              <form onSubmit={handleAuthSubmit}>
                {authView === 'register' && (
                  <>
                    <div className="input-field-group">
                      <label>Full Name</label>
                      <input className="styled-input" type="text" required placeholder="Alex Mercer" value={name} onChange={e => setName(e.target.value)} />
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
                  </>
                )}

                <div className="input-field-group">
                  <label>Email Address</label>
                  <input className="styled-input" type="email" required placeholder="alex@department.edu" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <div className="input-field-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Password</label>
                    {authView === 'login' && (
                      <button
                        type="button"
                        className="forgot-link-btn"
                        onClick={() => { setAuthView('forgot'); setAuthErr(''); setAuthSuccess(''); }}
                      >
                        Forgot Password?
                      </button>
                    )}
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

                <button className="btn-glow" type="submit">
                  {authView === 'login' ? 'Sign In to Portal →' : 'Complete Registration →'}
                </button>
              </form>
            )}

            <div className="auth-switch">
              {authView === 'login' && (
                <>Don't have an account?<button onClick={() => { setAuthView('register'); setAuthErr(''); setAuthSuccess(''); }}>Register</button></>
              )}
              {authView === 'register' && (
                <>Already have an account?<button onClick={() => { setAuthView('login'); setAuthErr(''); setAuthSuccess(''); }}>← Back to Sign In</button></>
              )}
              {authView === 'forgot' && (
                <>Remembered password?<button onClick={() => { setAuthView('login'); setAuthErr(''); setAuthSuccess(''); }}>← Back to Sign In</button></>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="app-shell">
          <aside className="glass-sidebar">
            <div className="sidebar-logo">
              <div className="logo-icon">✦</div>
              <span>INVENTORY MANAGEMENT PORTAL</span>
            </div>

            <nav className="nav-group">
              <div className="nav-link active">
                📦 Inventory Catalog
              </div>
            </nav>

            <div className="user-profile-badge">
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' }} onClick={() => setIsProfileModalOpen(true)}>
                  {session.name} ✏️
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Role: {session.role}</div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>Exit</button>
            </div>
          </aside>

          <main className="main-workspace">
            <header className="top-bar">
              <div>
                <h2>{session.role === 'Admin' ? 'Admin Dashboard' : 'User Dashboard'}</h2>
                <p>Real-time data synced directly with MongoDB Atlas Database</p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {session.role === 'Admin' && (
                  <>
                    <button type="button" className="btn-glow-compact" onClick={() => setIsAddModalOpen(true)}>
                      + Add Item
                    </button>
                    <button type="button" className="btn-glow-compact-sec" onClick={() => setIsCategoryModalOpen(true)}>
                      Categories
                    </button>
                    <button type="button" className="btn-glow-compact-sec" onClick={() => setIsReportModalOpen(true)}>
                      Reports
                    </button>
                  </>
                )}
              </div>
            </header>

            <section className="metrics-row">
              <div className="metric-card">
                <div className="metric-label">Total Inventory Products</div>
                <div className="metric-val">{totalProducts}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Low Stock Warnings</div>
                <div className="metric-val" style={{ color: '#f59e0b' }}>{lowStockProducts}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Out of Stock Items</div>
                <div className="metric-val" style={{ color: '#ef4444' }}>{outOfStockProducts}</div>
              </div>
            </section>

            <section className="glass-panel">
              <div className="panel-header">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Product Stock Listings</h3>
                <div className="action-bar" style={{ display: 'flex', gap: '0.6rem' }}>
                  <NeoSelect
                    style={{ width: '160px' }}
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    options={[
                      { categoryName: 'All', label: 'All Categories' },
                      ...categories
                    ]}
                  />
                  <input
                    className="styled-input"
                    style={{ width: '200px', padding: '0.45rem 0.8rem' }}
                    type="text"
                    placeholder="🔍 Search items..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="glass-table-wrapper">
                <table className="glass-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>Category</th>
                      <th>Qty</th>
                      <th>Unit Price</th>
                      <th>Supplier</th>
                      <th>Stock Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map(item => (
                        <tr key={item._id}>
                          <td style={{ fontWeight: 700, color: '#a5b4fc', cursor: 'pointer' }} onClick={() => setIsProductDetailsOpen(item)}>
                            {item.productName}
                          </td>
                          <td>{item.category}</td>
                          <td>{item.quantity}</td>
                          <td>₹{item.unitPrice?.toLocaleString()}</td>
                          <td>{item.supplierName}</td>
                          <td>
                            <span className={`status-pill ${item.quantity > 10 ? 'available' : item.quantity > 0 ? 'low' : 'out'}`}>
                              ● {item.quantity > 10 ? 'Available' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button className="btn-action-view" onClick={() => setIsProductDetailsOpen(item)}>Details</button>
                              {session.role === 'Admin' && (
                                <>
                                  <button className="btn-action-edit" onClick={() => { setEditingStockItem(item); setNewStockQty(item.quantity); }}>Stock</button>
                                  <button className="btn-action-delete" onClick={() => setItemToDelete(item)}>Delete</button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                          No inventory items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination-bar">
                <span>
                  Showing <strong style={{ color: '#fff' }}>{filteredList.length === 0 ? 0 : indexOfFirstItem + 1}</strong> to <strong style={{ color: '#fff' }}>{Math.min(indexOfLastItem, filteredList.length)}</strong> of <strong style={{ color: '#fff' }}>{filteredList.length}</strong> items
                </span>
                <div className="pagination-controls">
                  <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>← Prev</button>
                  <span className="page-num">Page {currentPage} of {totalPages}</span>
                  <button className="page-btn" disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(p => p + 1)}>Next →</button>
                </div>
              </div>
            </section>

            {/* Product Details Modal */}
            {isProductDetailsOpen && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Product Details</h3>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                    <p><strong>ID:</strong> {isProductDetailsOpen._id}</p>
                    <p><strong>Name:</strong> {isProductDetailsOpen.productName}</p>
                    <p><strong>Category:</strong> {isProductDetailsOpen.category}</p>
                    <p><strong>Stock Quantity:</strong> {isProductDetailsOpen.quantity}</p>
                    <p><strong>Unit Price:</strong> ₹{isProductDetailsOpen.unitPrice}</p>
                    <p><strong>Supplier:</strong> {isProductDetailsOpen.supplierName}</p>
                  </div>
                  <div className="modal-footer">
                    <button className="styled-input" style={{ width: 'auto' }} onClick={() => setIsProductDetailsOpen(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Update Stock Modal */}
            {editingStockItem && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Update Stock Quantity</h3>
                  <form onSubmit={handleUpdateStock}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Updating for: <strong>{editingStockItem.productName}</strong></p>
                    <div className="input-field-group">
                      <label>New Quantity</label>
                      <input className="styled-input" type="number" required value={newStockQty} onChange={e => setNewStockQty(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="styled-input" style={{ width: 'auto' }} onClick={() => setEditingStockItem(null)}>Cancel</button>
                      <button type="submit" className="btn-glow-compact">Save Stock</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Delete Modal */}
            {itemToDelete && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fca5a5', marginBottom: '0.5rem' }}>Confirm Deletion</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                    Are you sure you want to delete <strong style={{ color: '#fff' }}>"{itemToDelete.productName}"</strong>?
                  </p>
                  <div className="modal-footer">
                    <button className="styled-input" style={{ width: 'auto' }} onClick={() => setItemToDelete(null)}>Cancel</button>
                    <button className="btn-action-delete" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} onClick={confirmDelete}>Yes, Delete</button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Item Modal */}
            {isAddModalOpen && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1.5rem' }}>Add New Inventory Record</h3>
                  <form onSubmit={handleAddItem}>
                    <div className="input-field-group">
                      <label>Product Name</label>
                      <input className="styled-input" type="text" required placeholder="e.g. Epson Projector 4K" value={productName} onChange={e => setProductName(e.target.value)} />
                    </div>
                    <div className="input-field-group">
                      <label>Category</label>
                      <NeoSelect
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        options={categories}
                      />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="input-field-group">
                        <label>Quantity</label>
                        <input className="styled-input" type="number" required placeholder="25" value={quantity} onChange={e => setQuantity(e.target.value)} />
                      </div>
                      <div className="input-field-group">
                        <label>Unit Price (₹)</label>
                        <input className="styled-input" type="number" required placeholder="12000" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} />
                      </div>
                    </div>
                    <div className="input-field-group">
                      <label>Supplier Name</label>
                      <input className="styled-input" type="text" required placeholder="e.g. Acme Tech Solutions" value={supplierName} onChange={e => setSupplierName(e.target.value)} />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="styled-input" style={{ width: 'auto' }} onClick={() => setIsAddModalOpen(false)}>Cancel</button>
                      <button type="submit" className="btn-glow-compact">Save Product</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Manage Categories Modal */}
            {isCategoryModalOpen && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, textAlign: 'center', marginBottom: '1rem' }}>Manage Categories</h3>
                  <form onSubmit={handleAddCategory} style={{ marginBottom: '1.5rem' }}>
                    <div className="input-field-group">
                      <label style={{ textAlign: 'center' }}>Category Name</label>
                      <input className="styled-input" type="text" required placeholder="e.g. Stationery" value={catName} onChange={e => setCatName(e.target.value)} />
                    </div>
                    <div className="input-field-group">
                      <label style={{ textAlign: 'center' }}>Description</label>
                      <input className="styled-input" type="text" placeholder="Description" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                      <button type="submit" className="btn-glow-compact">Add Category</button>
                    </div>
                  </form>
                  
                  <div style={{ maxHeight: '160px', overflowY: 'auto', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '0.8rem' }}>
                    {categories.map(c => (
                      <div key={c._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <div>
                          <strong style={{ color: '#fff' }}>{c.categoryName}</strong> - <span style={{ color: 'var(--text-muted)' }}>{c.description}</span>
                        </div>
                        <button 
                          className="btn-action-delete" 
                          style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                          onClick={() => handleDeleteCategory(c._id)}
                          type="button"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="modal-footer" style={{ justifyContent: 'center' }}>
                    <button className="btn-glow-compact-sec" style={{ width: 'auto', minWidth: '100px' }} onClick={() => setIsCategoryModalOpen(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Reports Modal */}
            {isReportModalOpen && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Inventory Report</h3>
                  <div style={{ fontSize: '0.85rem', lineHeight: '1.8' }}>
                    <p><strong>Total Inventory Valuation:</strong> ₹{totalValuation.toLocaleString()}</p>
                    <p><strong>Total Items Tracked:</strong> {totalProducts}</p>
                    <p><strong>Low Stock Count:</strong> {lowStockProducts}</p>
                    <p><strong>Out of Stock Count:</strong> {outOfStockProducts}</p>
                  </div>
                  <div className="modal-footer">
                    <button className="styled-input" style={{ width: 'auto' }} onClick={() => setIsReportModalOpen(false)}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Modal */}
            {isProfileModalOpen && (
              <div className="modal-overlay">
                <div className="glass-modal">
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>Update Profile</h3>
                  <form onSubmit={handleProfileUpdate}>
                    <div className="input-field-group">
                      <label>Full Name</label>
                      <input className="styled-input" type="text" required value={session.name} onChange={e => setSession({ ...session, name: e.target.value })} />
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="styled-input" style={{ width: 'auto' }} onClick={() => setIsProfileModalOpen(false)}>Cancel</button>
                      <button type="submit" className="btn-glow-compact">Save Profile</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </main>
        </div>
      )}
    </>
  );
}