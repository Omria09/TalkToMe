import React, { useState } from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser , faPhoneVolume, faVideo } from '@fortawesome/free-solid-svg-icons'
import { handleSendMessage } from '../utils/firebase.js';
const { ipcRenderer } = window.electron;
import { useUid } from '../components/auth.js';
import { ChatComponent , getUserInfo } from '../utils/firebase.js';

/**
 * Renders the main home page of the application, including the sidebar with active chats and friends list, and the main content area that displays either the friends list or the chat interface for a selected friend.
 *
 * @returns {JSX.Element} - The rendered home page.
 */

const Home = () => {

    // Dummy data for active chats and friends list
    var activeChats = [
      { id: 1, name: 'Friend 1' },
      { id: 2, name: 'Friend 2' },
      { id: 3, name: 'Friend 3' },
    ];
  
  // Call the function to get user's chats
  var userChats =  ChatComponent('3IliKPWZYnTg3l64qdfrT8KV6ip1');

  for (let i = 0; i < userChats.length ; i++) {
    console.log(userChats[i]);
    var friendName = getFriendName(userChats[i].members);
    var tempchat = {id: userChats[i].id, name: friendName};
    activeChats.push(tempchat);
  }

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [viewingFriendsList, setViewingFriendsList] = useState(true);
  
  const friendsList = [
    { id: 1, name: 'A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME' },
    { id: 2, name: 'Friend B' },
    { id: 3, name: 'Friend C' },
    { id: 4, name: 'Friend D' },
    { id: 5, name: 'Friend E' },
    { id: 6, name: 'Friend F' },
  ];

  
  const friendCount = friendsList.length; //The total number of friends in the friendsList array.

  // Handles the click event on a friend in the friends list, setting the selected friend and switching the view to the chat interface.
  const handleFriendClick = (friend) => {
    setSelectedFriend(friend);
    setViewingFriendsList(false);
  };

  //Handles the click event to show the friends list in the main content area.
  const handleShowFriendsList = () => {
    setViewingFriendsList(true);
  };

  return (
    <>
      <Ui />
      <Header />
        <div className="App">

          <div className="sidebar">
            {/* "Friends" button to show friends list */}
            <button className="friends-btn" onClick={handleShowFriendsList}><FontAwesomeIcon icon={faUsers} /> Friends</button>
            <h5>Direct Messages</h5>
            <ul>
              {activeChats.map(chat => (
                <li key={chat.id} onClick={() => handleFriendClick(chat)}><FontAwesomeIcon icon={faUser} /> {chat.name}</li>
              ))}
            </ul>
          </div>

          <div className="main-content">
            {viewingFriendsList ? (
              <>
                <h2>All Friends - {friendCount}</h2>
                <ul>
                  {friendsList.map(friend => (
                    <li key={friend.id} onClick={() => handleFriendClick(friend)}><FontAwesomeIcon icon={faUser} /> {friend.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <Chat friend={selectedFriend} />
            )}
          </div>
      </div>
      <Footer />
    </>
  );
};

const fetchUsername = async (uid) => {
  const result = await getUserInfo(uid);
  if (result.success) {
    return result.data.username;
  } else {
    return result.error;
  }
};


const getFriendName = (members) => {
  var friendName = '';
  for (let i = 0; i < members.length; i++) {
    if (members[i] != '3IliKPWZYnTg3l64qdfrT8KV6ip1') { //change to uid
      friendName = members[i];
      friendName = fetchUsername(friendName);
      break;
    }
  }
  return friendName;
}


/**
 * Renders a chat interface for a selected friend.
 *
 * @param {Object} friend - The friend object containing information about the selected friend.
 * @returns {JSX.Element} - The rendered chat interface.
 */
const Chat = ({ friend }) => {
  
  // State to hold the input value
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');

  // Get the UID of the currently authenticated user
  const uid = useUid();
  if (!uid) {
    return <div>You are not logged in.</div>;
  }

  // Function to handle input change
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };
  
  // Dummy chat with selected friend
  var placeholder = "Message @" + friend.name;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      success,
      message,
      error: messageError,
    } = await handleSendMessage(inputValue, "text", "chatid", uid);
    if (success) {
      // Handle successful signup
      console.log(message);
    } else {
      // Handle signup error
      setError(messageError.message || "Sending a message has failed. Please try again.");
    }

    setInputValue(''); // clear the input field after sending
  };
  
  return (
    <>
    <div className='message-page'>
      <div className='chat-title'>
        <h4>Chat with {friend.name}</h4>
        <div className='chat-tools'>
          <FontAwesomeIcon icon={faPhoneVolume} size="lg" style={{marginRight: "2vh"}}/>
          <FontAwesomeIcon icon={faVideo} size="lg"/>
        </div>
      </div>
      {/* Display chat messages here */}
      <div className='chat-input-wrapper'>
        <input 
          className="chat-input"
          id="text-input"
          placeholder={placeholder}
          value={inputValue} // Bind the input value to the state
          onChange={handleInputChange} // Update the state when the input changes
        />
        <button className="send-button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
    </>
  );
};


export default Home;
