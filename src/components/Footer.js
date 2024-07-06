import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../components/auth.js';

/**
 * Renders the footer component for the application.
 * The footer includes a small avatar image and user information such as the user's email and online status.
 * The user's email is retrieved using the `isAuthenticated()` function from the `auth.js` module.
 */
const Footer = () => {
  return (
    <footer>
      <div className="small-avatar">
        <img src="https://placehold.co/50x50/png" alt="Avatar" />
        <div className="user-info">
          {<a className="user-email">{isAuthenticated()}</a>}
          {<a className="user-status">Online</a>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
