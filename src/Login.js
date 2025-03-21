// src/Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import styles for the login page

// Static admin credentials for testing
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'password123'
};

function Login({ setIsLoggedIn }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Function to check if username already exists
  const isUsernameTaken = (username) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.username === username);
  };

  // Function to check if email already exists
  const isEmailTaken = (email) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.some(user => user.email === email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    if (isUsernameTaken(formData.username)) {
      setError('Username is already taken');
      return false;
    }
    if (isEmailTaken(formData.email)) {
      setError('Email is already registered');
      return false;
    }
    return true;
  };

  const saveUser = (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push({
      username: userData.username,
      email: userData.email,
      password: userData.password, // In a real app, this should be hashed
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('users', JSON.stringify(users));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (isSignUp) {
        // Sign Up Logic
        if (!validateSignUp()) {
          setIsLoading(false);
          return;
        }
        
        // Save the new user
        saveUser(formData);
        
        // Log the user in
        localStorage.setItem('currentUser', JSON.stringify({
          username: formData.username,
          email: formData.email
        }));
        setIsLoggedIn(true);
        navigate('/portfolio');
      } else {
        // Sign In Logic
        // First check admin credentials
        if (formData.username === ADMIN_CREDENTIALS.username && 
            formData.password === ADMIN_CREDENTIALS.password) {
          localStorage.setItem('currentUser', JSON.stringify({
            username: ADMIN_CREDENTIALS.username,
            isAdmin: true
          }));
          setIsLoggedIn(true);
          navigate('/portfolio');
          return;
        }

        // Then check regular user credentials
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === formData.username && u.password === formData.password);
        
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify({
            username: formData.username,
            email: user.email
          }));
          setIsLoggedIn(true);
          navigate('/portfolio');
        } else {
          setError('Invalid username or password');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setFormData({
      username: '',
      password: '',
      confirmPassword: '',
      email: ''
    });
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-content">
        <div className="login-box">
          <div className="login-header">
            <h1>{isSignUp ? 'Create Account' : 'Welcome Back!'}</h1>
            <p className="login-subtitle">
              {isSignUp 
                ? 'Sign up to create your portfolio account' 
                : 'Enter your credentials to access your portfolio'}
            </p>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">
                <span className="input-icon">👤</span>
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
                className="form-input"
                autoComplete="username"
              />
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="email">
                  <span className="input-icon">📧</span>
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="form-input"
                  autoComplete="email"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">
                <span className="input-icon">🔒</span>
                Password
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder={isSignUp ? "Choose a password" : "Enter your password"}
                  required
                  className="form-input"
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
            </div>

            {isSignUp && (
              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="input-icon">🔒</span>
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    className="form-input"
                    autoComplete="new-password"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className={`login-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading 
                ? (isSignUp ? 'Creating Account...' : 'Signing in...') 
                : (isSignUp ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          {!isSignUp && (
            <div className="demo-credentials">
              <h4>Test Credentials:</h4>
              <p>Username: {ADMIN_CREDENTIALS.username}</p>
              <p>Password: {ADMIN_CREDENTIALS.password}</p>
            </div>
          )}

          <div className="login-footer">
            <button onClick={toggleMode} className="toggle-mode-button">
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;