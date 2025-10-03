import { createContext, useContext, useState, useEffect } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const API_GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Restore session
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/token/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Invalid credentials');
      }
      const data = await res.json();
      const access = data.access;
      if (!access) throw new Error('Missing access token');

      // Fetch user details using the access token
      const meRes = await fetch(`${API_URL}/auth/me/`, {
        headers: { 'Authorization': `Bearer ${access}` }
      });
      let authUser = { email, username: email };
      if (meRes.ok) {
        const me = await meRes.json();
        authUser = {
          username: me.username || email,
          email: me.email || email,
          name: me.name || null,
        };
      }
      localStorage.setItem('token', access);
      localStorage.setItem('user', JSON.stringify(authUser));
      setToken(access);
      setUser(authUser);

      return { success: true, user: authUser, token: access };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (name, email, password) => {
    try {
      // Use email as username for simplicity
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, email, password, first_name: name })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        // Common error: duplicate email/username
        throw new Error(err.email?.[0] || err.username?.[0] || 'Registration failed');
      }
      // Auto-login after registration
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const setSession = (newUser, newToken) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const googleLogin = async (idToken) => {
    try {
      const res = await fetch(`${API_URL}/auth/google/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: idToken })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.detail || 'Google login failed');
      }
      const data = await res.json();
      const access = data.access;
      const authUser = data.user || null;
      if (!access || !authUser) throw new Error('Invalid server response');

      setSession(authUser, access);
      return { success: true, user: authUser, token: access };
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    setSession,
    googleLogin,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};