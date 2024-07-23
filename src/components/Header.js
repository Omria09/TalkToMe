import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

// Use `ipcRenderer` from `window.electron` to handle inter-process communication
const { ipcRenderer } = window.electron;

/**
 * Renders the header component for the application.
 * The header includes links for navigation, a logout button, and displays the current user's email if authenticated.
 * The component uses the `ipcRenderer` from the `electron` module to communicate with the main process for user authentication and logout functionality.
 */
const Header = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleCurrentUser = (email) => {
    if (email) {
      setEmail(email);
    } else {
      setError('No user logged in');
    }
  };
  
  useEffect(() => {

    const handleCurrentUserError = (errorMessage) => {
      setError(`Failed to retrieve user data: ${errorMessage}`);
    };

    const handleLogoutSuccess = (event, data) => {
      console.log('Logout successful', data);
      navigate('/login'); // Redirect to login page
    };

    const handleLogoutError = (errorMessage) => {
      setError(`Logout failed: ${errorMessage}`);
    };

    ipcRenderer.send('get-current-user');
    ipcRenderer.on('current-user', handleCurrentUser);
    ipcRenderer.on('current-user-error', handleCurrentUserError);
    ipcRenderer.on('logout-success', handleLogoutSuccess);
    ipcRenderer.on('logout-error', handleLogoutError);

    // Cleanup listeners on component unmount
    return () => {
      ipcRenderer.removeListener('current-user', handleCurrentUser);
      ipcRenderer.removeListener('current-user-error', handleCurrentUserError);
      ipcRenderer.removeListener('logout-success', handleLogoutSuccess);
      ipcRenderer.removeListener('logout-error', handleLogoutError);
    };
  }, [navigate]);

  const handleLogout = () => {
    ipcRenderer.send('logout');
  };

  return (
    <nav>
      <ul>
        {isAuthenticated() && <li><Link to="/">Home</Link></li>}
        {isAuthenticated() && <li><Link to="/profile">Profile</Link></li>}
        {!isAuthenticated() && <li><Link to="/login">Login</Link></li>}
        {!isAuthenticated() && <li><Link to="/signup">Signup</Link></li>}
        {isAuthenticated() && (
          <li>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
