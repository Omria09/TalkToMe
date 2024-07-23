import React, { useState, useEffect } from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import '../Profile.css';
import { useUid } from '../components/auth.js';
import { getUserInfo} from '../utils/firebase.js';

const fetchUserData = async (uid) => {
  console.log(uid);
  const result = await getUserInfo(uid);
  if (result.success) {
    console.log(result.data);
    return result.data;
  } else {
    throw new Error(result.error);
  }
};
      
const Profile = () => {
  const uid = useUid();
  const [username, setUsername] = useState('');
  const [pictureUrl, setPictureurl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(()=>{
    if (uid){
      const getUserData = async() =>{
        try{
          const user = await fetchUserData(uid);
          setUsername(user.username);
          setPictureurl(user.photoURL);
        } catch (error) {
          setError(error.message);
        }finally{
          setLoading(false);
        }
      };
      getUserData();
    }
  })
  return (
    <>
      <Ui />
      <Header />
      <div className="profile-container">
      <div className="profile-header">
        <div className="avatar">
          <img src={pictureUrl} alt="Avatar"/>
        </div>
        <div className="user-details">
          <h1>{username}</h1>
          <p className="status">Online</p>
        </div>
      </div>
      <div className="profile-body">
        <div className="profile-info">
          <h2>Bio.</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla viverra velit sed faucibus vehicula.</p>
        </div>
      </div>
    </div>

    </>
  );
};

export default Profile;
