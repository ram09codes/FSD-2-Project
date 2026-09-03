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
// TARGETED NEOMORPHIC DIFFUSION PARTICLES
// ==========================================
function NeoParticleEffect({ targetBounds, onComplete }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#E62C5E', '#88A2BC', '#F1F5F9', '#38BDF8'];
    const particleCount = 70;

    // Use row coordinates or screen center as fallback
    const originX = targetBounds ? targetBounds.left + targetBounds.width / 2 : canvas.width / 2;
    const originY = targetBounds ? targetBounds.top + targetBounds.height / 2 : canvas.height / 2;
    const spreadWidth = targetBounds ? targetBounds.width * 0.8 : 200;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: originX + (Math.random() - 0.5) * spreadWidth,
        y: originY + (Math.random() - 0.5) * 20,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 3.5 - 1.5, // Ascend upwards
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        fade: Math.random() * 0.025 + 0.015,
      });
    }

    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let activeCount = 0;

      particles.forEach((p) => {
        if (p.alpha > 0) {
          activeCount++;
          p.x += p.vx;
          p.y += p.vy;
          p.alpha -= p.fade;

          ctx.save();
          ctx.globalAlpha = Math.max(p.alpha, 0);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      if (activeCount > 0) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        if (onComplete) onComplete();
      }
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, [targetBounds, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
}

export default function Dashboard({ session, setSession }) {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [editingStockItem, setEditingStockItem] = useState(null);
  const [newStockQty, setNewStockQty] = useState('');

  // Diffusion Effect Target Bounds State
  const [diffusionBounds, setDiffusionBounds] = useState(null);

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');

  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPortalData();
  }, []);

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

  const handleLogout = () => {
    apiService.logout();
    setSession(null);
  };

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
      const targetId = itemToDelete._id;
      
      // Get the precise screen location of the row before closing the card
      const rowElem = document.getElementById(`row-${targetId}`);
      if (rowElem) {
        setDiffusionBounds(rowElem.getBoundingClientRect());
      } else {
        setDiffusionBounds({ top: window.innerHeight / 2, left: window.innerWidth / 2, width: 300, height: 40 });
      }

      // Close modal card immediately
      setItemToDelete(null);

      try {
        const updated = await apiService.deleteInventoryItem(targetId);
        setInventory(updated);
      } catch (err) {
        alert(err.message);
        setDiffusionBounds(null);
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
    <div className="app-shell">
      {/* Particle Diffusion triggered right as card disappears */}
      {diffusionBounds && (
        <NeoParticleEffect
          targetBounds={diffusionBounds}
          onComplete={() => setDiffusionBounds(null)}
        />
      )}

      <aside className="glass-sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">✦</div>
          <span>INVENTORY MANAGEMENT PORTAL</span>
        </div>

        <nav className="nav-group">
          <div className="nav-link active">📦 Inventory Catalog</div>
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
                <button type="button" className="btn-glow-compact" onClick={() => setIsAddModalOpen(true)}>+ Add Item</button>
                <button type="button" className="btn-glow-compact-sec" onClick={() => setIsCategoryModalOpen(true)}>Categories</button>
                <button type="button" className="btn-glow-compact-sec" onClick={() => setIsReportModalOpen(true)}>Reports</button>
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
                    <tr key={item._id} id={`row-${item._id}`}>
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

        {/* Confirm Delete Modal */}
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
  );
}