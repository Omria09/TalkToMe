import React, { useState, useEffect } from 'react';
import { HashRouter, Route, Routes } from "react-router-dom";
import Login from './components/Login.js';
import Signup from './components/Signup.js';
import Home from './pages/Home.js';
import Profile from './pages/Profile.js';
import './styles.css';
import PrivateRoute from './components/PrivateRoute.js';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in from local storage
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  return (
  <HashRouter>
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Private Routes */}
        <Route
          path="/"
          element={<PrivateRoute> <Home /> </PrivateRoute>}/>
        
        <Route
          path="/profile"
          element={<PrivateRoute> <Profile /> </PrivateRoute>}
        />
    </Routes>
  </HashRouter>
  );
};

{/* <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<PrivateRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} /> */}

export default App;
