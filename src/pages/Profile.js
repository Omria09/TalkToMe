import React from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import '../Profile.css';
import { isAuthenticated } from '../components/auth.js';

const Profile = () => {
  return (
    <>
      <Ui />
      <Header />
      <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          <img src="https://via.placeholder.com/150" alt="Avatar" />
        </div>
        <div className="user-details">
          <h1>{isAuthenticated()}</h1>
          <p className="status">Online</p>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-info">
          <h2>About Me</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra velit sed faucibus vehicula.</p>
        </div>
      </div>
    </div>

    </>
  );
};

export default Profile;
