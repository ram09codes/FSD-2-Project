import React, { useRef } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onNavigate, products = [], onDeleteProduct }) {
  const { user, logout } = useAuth();
  const canvasRef = useRef(null);

  // Initial stock data fallback if products array is empty
  const stockList = products.length > 0 ? products : [
    { id: '1', name: 'Computers', category: 'Electronics', quantity: 5, price: 45000, supplier: 'Tech Corp' },
    { id: '2', name: 'Lights', category: 'Electrical', quantity: 9, price: 1200, supplier: 'BrightLite Supplies' },
    { id: '3', name: 'Office Chairs', category: 'Furniture', quantity: 14, price: 6500, supplier: 'ErgoDesign' },
    { id: '4', name: 'Projectors', category: 'Electronics', quantity: 2, price: 32000, supplier: 'Vision System' },
  ];

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const handleDeleteWithEvaporation = (e, id, name) => {
    const isConfirmed = window.confirm(`Are you sure you want to delete "${name || 'this item'}"?`);
    if (!isConfirmed) return;

    const button = e.currentTarget;
    const row = button.closest('tr');
    if (!row) return;

    const rect = row.getBoundingClientRect();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 180;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: rect.left + Math.random() * rect.width,
        y: rect.top + Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 5.5,
        vy: -(Math.random() * 4.5 + 2.0),
        size: Math.random() * 6 + 2,
        alpha: 1.0,
        decay: Math.random() * 0.015 + 0.012,
        color: Math.random() > 0.4 ? '#E62C5E' : '#88A2BC'
      });
    }

    let animationFrameId;
    const renderDiffusion = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeParticles = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          activeParticles++;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.decay;

          ctx.save();
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 12;
          ctx.shadowColor = '#E62C5E';
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (activeParticles > 0) {
        animationFrameId = requestAnimationFrame(renderDiffusion);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    renderDiffusion();
    row.classList.add('row-diffusing');

    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (onDeleteProduct) onDeleteProduct(id);
    }, 550);
  };

  const totalItemsCount = stockList.reduce((sum, item) => sum + Number(item.quantity), 0);
  const lowStockCount = stockList.filter(item => item.quantity > 0 && item.quantity <= 5).length;
  const outOfStockCount = stockList.filter(item => item.quantity === 0).length;

  return (
    <div className="app-shell">
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 9999
        }}
      />

      <aside className="glass-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✦</div>
          <span>INVENTORY PORTAL</span>
        </div>

        <div className="nav-link active">Dashboard</div>
        <div className="nav-link">Inventory Catalog</div>

        <div className="user-profile-badge">
          <div>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#FFF' }}>{user?.name || 'Admin User'}</div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Role: {user?.role || 'Admin'}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-workspace">
        <div className="top-bar">
          <div>
            <h2>Stock Inventory Overview</h2>
            <p>Real-time updates synced with your database</p>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button className="btn-glow-compact">+ Add Item</button>
            <button className="btn-glow-compact-sec">Categories</button>
            <button className="btn-glow-compact-sec">Reports</button>
          </div>
        </div>

        <div className="metrics-row">
          <div className="metric-card">
            <div className="metric-label">Total Stock Quantity</div>
            <div className="metric-val">{totalItemsCount} units</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Low Stock Alerts</div>
            <div className="metric-val" style={{ color: '#FBBF24' }}>{lowStockCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Out of Stock Items</div>
            <div className="metric-val" style={{ color: '#E62C5E' }}>{outOfStockCount}</div>
          </div>
        </div>

        <div className="glass-panel">
          <div className="panel-header">
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Item Stock Listings</h3>
          </div>

          <div className="glass-table-wrapper">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Supplier</th>
                  <th>Availability</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stockList.map((item) => (
                  <tr key={item._id || item.id}>
                    <td>
                      <span className="product-name-link">{item.name || item.productName}</span>
                    </td>
                    <td>{item.category}</td>
                    <td style={{ fontWeight: 800 }}>{item.quantity}</td>
                    <td>₹{item.price || item.unitPrice}</td>
                    <td>{item.supplier || item.supplierName}</td>
                    <td>
                      <span className={`status-pill ${item.quantity > 5 ? 'available' : item.quantity > 0 ? 'low' : 'out'}`}>
                        ● {item.quantity > 5 ? 'In Stock' : item.quantity > 0 ? 'Low Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button className="btn-action-view">Details</button>
                        <button className="btn-action-edit">Stock</button>
                        <button
                          className="btn-action-delete"
                          onClick={(e) => handleDeleteWithEvaporation(e, item._id || item.id, item.name || item.productName)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-bar">
            <span>Showing {stockList.length} categories listed</span>
            <div className="pagination-controls">
              <button className="page-btn" disabled>← Prev</button>
              <span className="page-num">1</span>
              <button className="page-btn" disabled>Next →</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}