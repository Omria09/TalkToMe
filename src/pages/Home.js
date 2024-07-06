import React, { useState } from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faUser , faPhoneVolume, faVideo } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
    // Dummy data for active chats and friends list
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [viewingFriendsList, setViewingFriendsList] = useState(true);

    const activeChats = [
      { id: 1, name: 'Friend 1' },
      { id: 2, name: 'Friend 2' },
      { id: 3, name: 'Friend 3' },
    ];
  
    const friendsList = [
      { id: 1, name: 'A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME' },
      { id: 2, name: 'Friend B' },
      { id: 3, name: 'Friend C' },
      { id: 4, name: 'Friend D' },
      { id: 5, name: 'Friend E' },
      { id: 6, name: 'Friend F' },
    ];

    const friendCount = friendsList.length;

    const handleFriendClick = (friend) => {
      setSelectedFriend(friend);
      setViewingFriendsList(false);
    };

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

const Chat = ({ friend }) => {
  // Dummy chat with selected friend
  var placeholder = "Message @" + friend.name;

  const handleSubmit = () => {
    // Implement your send message functionality here
    console.log("Message sent!");
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
        />
        <button className="send-button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
    </>
  );
};


export default Home;
