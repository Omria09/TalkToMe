import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Ui from './Ui.js';
import Header from './Header.js';
import '../login.css'
import { Link } from 'react-router-dom';
import { handleLogin } from '../utils/firebase.js';

const { ipcRenderer } = window.electron;
const keytar = window.electron.keytar; // Import Keytar


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { success, user, error: loginError } = await handleLogin(email, password);
    if (success) {
      // Send login data to main process
      window.electron.ipcRenderer.send('save-login-data', { email, password });

      // Listen for successful data save
      window.electron.ipcRenderer.receive('login-data-saved', () => {
        setMessage('Login data saved successfully!');
        navigate('/'); // Redirect to home page
      });

      // Listen for save error
      window.electron.ipcRenderer.receive('login-data-save-error', (errorMessage) => {
        setError(`Failed to save login data: ${errorMessage}`);
      });
    } else {
      // Handle login error
      setError(loginError.message || 'Login failed. Please try again.');
    }
  };
  
  return (
    <>
    <Ui />
    {/* <Header /> */}
    <div className="container bg-gradient-to-r from-blue-400 to-indigo-600">
      <div className="card">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-900 select-none">Login</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-4">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group mb-6">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button
            type="submit"
            className="btn-login"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4 select-none">
          Don't have an account? <Link to="/signup" className="signup-link">Sign up</Link>
        </p>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
    </>
  );
};

export default Login;
