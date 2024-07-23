import React, { useEffect, useState } from 'react';
import { useUid } from '../components/auth.js';
import { getUserInfo} from '../utils/firebase.js';


const fetchUserData = async (uid) => {
  const result = await getUserInfo(uid);
  if (result.success) {
    return result.data;
  } else {
    throw new Error(result.error);
  }
};
     

/**
 * Renders the footer component for the application.
 * The footer includes a small avatar image and user information such as the user's email and online status.
 * The user's email is retrieved using the `isAuthenticated()` function from the `auth.js` module.
 */
const Footer = () => {
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
    <footer>
      <div className="small-avatar">
        <img src={pictureUrl} alt="Avatar"/>
        <div className="user-info">
          {<a className="user-displayname">{username}</a>}
          <div className='online-status'>
            <div className="status-dot"></div>
            {<a className="user-status">Online</a>}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
