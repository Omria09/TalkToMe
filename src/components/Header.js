import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
const { ipcRenderer } = window.electron;
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth';


const Header = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Send a request to get login data
    ipcRenderer.send('get-current-user');

    // Receive the login data
   ipcRenderer.receive('current-user', (email) => {
    if (email){
      setEmail(email);
    }else{
      setError('No user logged in');
    }
  });

    // Handle errors
    ipcRenderer.receive('current-user-error', (errorMessage) => {
      setError(`Failed to retrieve user data: ${errorMessage}`);
    });
  }, []);

  const handleLogout = () => {
    // Send logout request to main process
    ipcRenderer.send('logout');

    // Handle logout response
    ipcRenderer.receive('logout-success', () => {
      navigate('/login'); // Redirect to login page
    });

    // Handle logout error
    ipcRenderer.receive('logout-error', (errorMessage) => {
      setError(`Logout failed: ${errorMessage}`);
    });
  };
  return (
    <nav>
        <ul>
          <li>
            {isAuthenticated() ? <Link to="/">Home</Link> : null}
          </li>
          <li>
            {isAuthenticated() ? <Link to="/profile">Profile</Link> : null}
          </li>
          <li>
            {!isAuthenticated() ? <Link to="/login">Login</Link> : null}
          </li>
          <li>
            {!isAuthenticated() ? <Link to="/signup">Signup</Link> : null}
          </li>
          <li>
            {isAuthenticated() ?
            <button onClick={handleLogout} className="logout-button">Logout</button> 
            : null}
          </li>
          <li>
            {/* {<a className="user-email">{email}</a>}
            {error && <a className="error-message">{error}</a>} */}
          </li>
        </ul>
      </nav>
  );
};

export default Header;
