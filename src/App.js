// src/App.js
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './index.css';
import Login from './Login';
import Portfolio from './Portfolio';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && (
          <nav className="app-nav">
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </nav>
        )}
        <Routes>
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/portfolio" /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route
            path="/portfolio"
            element={isLoggedIn ? <Portfolio /> : <Navigate to="/login" />}
          />
          <Route path="/" element={<Navigate to={isLoggedIn ? "/portfolio" : "/login"} />} />
          <Route path="*" element={<Navigate to={isLoggedIn ? "/portfolio" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;