import React, { useState, useEffect, useId } from 'react';
import Ui from '../components/Ui.js';
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser, faPhoneVolume, faVideo } from '@fortawesome/free-solid-svg-icons';
import { handleSendMessage } from '../utils/firebase.js';
const { ipcRenderer } = window.electron;
import { useUid } from '../components/auth.js';
import { ChatComponent, getUserInfo , fetchMessages} from '../utils/firebase.js';
import Timestamp from '../components/Timestamp.js';
import WebRTCComponent from '../components/WebRTCComponent.js';

const Home = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [viewingFriendsList, setViewingFriendsList] = useState(true);
  const [friendsList, setFriendsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const uid = useUid();

  useEffect(() => {
    if (!uid) return; // Return early if uid is not set

    const fetchChats = async () => {
      try {
        // Fetch chats using uid
        const userChats = await ChatComponent(uid);
        const chatsWithNames = await Promise.all(userChats.map(async (chat) => {
          const friendName = await getFriendName(chat.members, uid);
          return { id: chat.id, name: friendName };
        }));
        setActiveChats(chatsWithNames);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch chats');
        setLoading(false);
      }
    };

    fetchChats();
  }, [uid]); // Depend on uid

  useEffect(() => {
    // Dummy friends list, replace with actual data if needed
    setFriendsList([
      { id: 1, name: 'A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME A VERY LONG NAME' },
      { id: 2, name: 'Friend B' },
      { id: 3, name: 'Friend C' },
      { id: 4, name: 'Friend D' },
      { id: 5, name: 'Friend E' },
      { id: 6, name: 'Friend F' },
    ]);
  }, []);

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
          <button className="friends-btn" onClick={handleShowFriendsList}>
            <FontAwesomeIcon icon={faUsers} /> Friends
          </button>
          <h5>Direct Messages</h5>
          {loading ? (
            <p>Loading chats...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <ul>
              {activeChats.map(chat => (
                <li key={chat.id} onClick={() => handleFriendClick(chat)}>
                  <FontAwesomeIcon icon={faUser} /> {chat.name} 
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="main-content">
          {viewingFriendsList ? (
            <>
              <h2>All Friends - {friendsList.length}</h2>
              <ul>
                {friendsList.map(friend => (
                  <li key={friend.id} onClick={() => handleFriendClick(friend)}>
                    <FontAwesomeIcon icon={faUser} /> {friend.name}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <Chat friend={selectedFriend} chatId={selectedFriend?.id} />
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
    throw new Error(result.error);
  }
};

const getFriendName = async (members, uid) => {
  for (let i = 0; i < members.length; i++) {
    if (members[i] !== uid) { 
      try {
        return await fetchUsername(members[i]);
      } catch (error) {
        console.error('Failed to fetch username:', error);
        return 'Unknown';
      }
    }
  }
  return 'Unknown';
};


const Chat = ({ friend, chatId }) => {
  
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false); // State for voice chat
  const uid = useUid();

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const result = await fetchMessages(chatId);
        if (result.success) {
          setMessages(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to fetch messages.');
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      loadMessages();
    }
  }, [chatId]);

  useEffect(() => {
    // This effect will run whenever messages state changes
  }, [messages, error]);

  if (!uid) {
    return <div>You are not logged in.</div>;
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new message object
    const newMessage = {
      senderId: uid,
      text: inputValue,
      timestamp: new Date().toISOString(), // Use the current timestamp
    };

    // Update the local state with the new message
    setMessages(prevMessages => [...prevMessages, newMessage]);
    
    try {
      const { success, message, error: messageError } = await handleSendMessage(inputValue, 'text', chatId, uid);
      if (success) {
        console.log(message);
      } else {
        setError(messageError.message || 'Sending a message has failed. Please try again.');
        // Remove the message from local state if it fails to send
        setMessages(prevMessages => prevMessages.filter(msg => msg.timestamp !== newMessage.timestamp));
      }
    } catch (error) {
      setError('Failed to send message. Please try again.');
      // Remove the message from local state if it fails to send
      setMessages(prevMessages => prevMessages.filter(msg => msg.timestamp !== newMessage.timestamp));
    }

    setInputValue('');
  };

  const handleVoiceChat = () => {
    setIsVoiceChatActive(true);
  }

  return (
    <div className='message-page'>
    {isVoiceChatActive ? (
      <div className='voice-chat-wrapper'>
      <WebRTCComponent chatID={chatId} />
      </div>
    ) : (
      <div className='chat-title'>
        <h4>Chat with {friend.name}</h4>
        <div className='chat-tools'>
          <FontAwesomeIcon className="fa-icon" icon={faPhoneVolume} size="lg" style={{ marginRight: '2vh' }} onClick={handleVoiceChat} />
          <FontAwesomeIcon className="fa-icon" icon={faVideo} size="lg" onClick={handleVoiceChat} />
        </div>
      </div>
    )}
      
      <div className='chat-messages-wrapper'>
        {loading && <p>Loading messages...</p>}
        {error && <p>Error: {error}</p>}
            {[...messages].reverse().map((message, index) => (
              <div key={index} className={message.senderId === uid? 'my-message' : 'other-message'}>
              {message.senderId === uid ? (<>
                  <span className='sender-id'> (You) </span>
                  <Timestamp timestamp={message.timestamp} />
                  <span>{" " + message.text}</span>
              </>
              ) : (
                <>
                  <span>{" " + message.text + " "}</span>
                  <Timestamp timestamp={message.timestamp} />
                </>
              )}
              </div>
            ))}
        </div>
      <div>
    </div>

      <div className='chat-input-wrapper'>
        <input
          className="chat-input"
          id="text-input"
          placeholder={`Message @${friend.name}`}
          value={inputValue}
          onChange={handleInputChange}
        />
        <button className="send-button" onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default Home;
