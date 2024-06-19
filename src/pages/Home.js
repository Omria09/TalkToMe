import React, { useState } from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
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
      { id: 1, name: 'Friend A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME' },
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

    async function fetchJoke() {
      try {
          const response = await fetch('https://api.chucknorris.io/jokes/random');
          if (!response.ok) {
              throw new Error('Network response was not ok ' + response.statusText);
          }
          const data = await response.json();
          document.getElementById('joke-container').innerText = data.value;
      } catch (error) {
          console.error('There has been a problem with your fetch operation:', error);
      }
  }
  fetchJoke();

  return (
    <>
      <Ui />
      <Header />
        <div className="App">

          <div className="sidebar">
            {/* "Friends" button to show friends list */}
            <button className="friends-btn" onClick={handleShowFriendsList}>Friends</button>
            <h2>Active Chats</h2>
            <ul>
              {activeChats.map(chat => (
                <li key={chat.id} onClick={() => handleFriendClick(chat)}>{chat.name}</li>
              ))}
            </ul>
          </div>

          <div className="main-content">
            {viewingFriendsList ? (
              <>
                <h2>All Friends - {friendCount}</h2>
                <ul>
                  {friendsList.map(friend => (
                    <li key={friend.id} onClick={() => handleFriendClick(friend)}>{friend.name}</li>
                  ))}
                </ul>
              </>
            ) : (
              <Chat friend={selectedFriend} />
            )}
          </div>

          <div className="video-placeholder">
            <h2>Daily quote</h2>
            {/* <p>No videos to display</p> */}
              <div class="joke" id="joke-container"></div>
            </div>
      </div>
      <Footer />
    </>
  );
};

const Chat = ({ friend }) => {
  // Dummy chat with selected friend
  return (
    <>
      <h2>Chat with {friend.name}</h2>
      {/* Display chat messages here */}
    </>
  );
};


export default Home;
