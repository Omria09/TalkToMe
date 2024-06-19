import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Ui from './Ui.js';
import Header from './Header.js';
import { handleSignup, handleLogin } from '../utils/firebase.js'


const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    const { success, user, error: signupError } = await handleSignup(email, password);
    if (success) {
        // Handle successful signup
        console.log(user);
        navigate('/'); // Redirect to home page
    } else {
        // Handle signup error
        setError(signupError.message || 'Signup failed. Please try again.');
    }
};

  return (
    <>
    <Ui />
    {/* <Header /> */}
    <div className="container bg-gradient-to-r from-blue-400 to-indigo-600">
        <div className="card">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 select-none">Sign Up</h2>
          {error && <p className="text-red-500">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-group mb-4">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group mb-6">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <button
              type="submit"
              className="btn-login"
            >
              Sign Up
            </button>
          </form>
          <p className="text-center text-gray-600 mt-4 select-none">
            Already have an account? <Link to="/login" className="signup-link">Log in</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Signup;
