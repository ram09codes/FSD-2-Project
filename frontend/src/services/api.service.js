const API_URL = "https://fsd-2-project-api.onrender.com/api";

export const apiService = {
  // Session handling
  getCurrentSession: () => {
    const session = localStorage.getItem('userSession');
    return session ? JSON.parse(session) : null;
  },

  // Auth Operations
  loginUser: async (email, password) => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Adapt user object to match UI expectations
    const sessionUser = {
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
      role: data.user.role === 'admin' ? 'Admin' : 'User',
    };

    localStorage.setItem('userSession', JSON.stringify(sessionUser));
    return sessionUser;
  },

  registerUser: async ({ name, email, password, role }) => {
    const response = await fetch(`${API_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: name,
        email,
        password,
        role: role || 'admin',
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }
    return data;
  },

  resetPassword: async (email, newPassword) => {
    const response = await fetch(`${API_URL}/users/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), newPassword }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update password');
    }
    return data;
  },

  logout: () => {
    localStorage.removeItem('userSession');
  },

  updateProfile: async (newName) => {
    const session = apiService.getCurrentSession();
    if (session) {
      session.name = newName;
      localStorage.setItem('userSession', JSON.stringify(session));
    }
    return session;
  },

  // Inventory Endpoints
  getInventory: async () => {
    try {
      const res = await fetch(`${API_URL}/inventory`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  getCategories: async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  },

  addInventoryItem: async (item) => {
    const res = await fetch(`${API_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Failed to add inventory item');
    return apiService.getInventory();
  },

  updateStock: async (id, quantity) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Failed to update stock');
    return apiService.getInventory();
  },

  deleteInventoryItem: async (id) => {
    const res = await fetch(`${API_URL}/inventory/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete item');
    return apiService.getInventory();
  },

  addCategory: async (categoryName, description) => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryName, description }),
    });
    if (!res.ok) throw new Error('Failed to add category');
    return apiService.getCategories();
  },

  deleteCategory: async (id) => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete category');
    return apiService.getCategories();
  },
};
