import React, { useEffect, useState } from 'react';
import { isAuthenticated } from '../components/auth.js';

const Footer = () => {

  return (
    <footer>
      <div className="small-avatar">
        <img src="https://placehold.co/50x50/png" alt="Avatar" />
        <div className='user-info'>
          {<a className="user-email">{isAuthenticated()}</a>}
          {<a className="user-status">Online</a>}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
