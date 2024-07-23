import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash, faVolumeXmark, faMicrophoneSlash  } from '@fortawesome/free-solid-svg-icons';

const WebRTCComponent = ({ chatID }) => {
  const [peer, setPeer] = useState(null);
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isRinging, setIsRinging] = useState(false); // State to manage ringing sound

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const resizableRef = useRef(null);
  const handleRef = useRef(null);

  const ringingSoundRef = useRef(null); // Ref for the ringing sound
  const hangupSoundRef = useRef(null) //Ref for the hangup sound
  const muteSoundRef = useRef(null) //Ref for the mute sound
  const unmuteSoundRef = useRef(null);
  
  useEffect(() => {
    // Initialize the ringing sound
    ringingSoundRef.current = new Audio('/assets/sounds/ringtone.mp3');
    hangupSoundRef.current = new Audio('/assets/sounds/hangup.mp3');
    muteSoundRef.current = new Audio('/assets/sounds/mute.mp3');
    unmuteSoundRef.current = new Audio('/assets/sounds/unmute.mp3');

    const initWebRTC = async () => {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(localStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }

      const newPeer = new Peer({
        initiator: true,
        trickle: false,
        stream: localStream,
      });

      newPeer.on('signal', (data) => {
        // Send signal data to the remote peer via your signaling server
        // Example: socket.emit('signal', { chatID, data });
      });

      newPeer.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
        // Stop ringing sound when call is answered
        if (isRinging) {
          ringingSoundRef.current.pause();
          ringingSoundRef.current.currentTime = 0;
          setIsRinging(false);
        }
      });

      setPeer(newPeer);
      // Start ringing sound
      ringingSoundRef.current.loop = true;
      ringingSoundRef.current.play();
      setIsRinging(true);
    };

    initWebRTC();

    return () => {
      if (peer) {
        peer.destroy();
      }
      if (ringingSoundRef.current) {
        ringingSoundRef.current.pause();
        ringingSoundRef.current.currentTime = 0;
      }
    };
  }, [chatID]);

  const handleHangup = () => {
    hangupSoundRef.current.play();
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (peer) {
      peer.destroy();
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (ringingSoundRef.current) {
      ringingSoundRef.current.pause();
      ringingSoundRef.current.currentTime = 0;
    }
  };

  const handleMute = () => {
    isMuted? unmuteSoundRef.current.play() :  muteSoundRef.current.play();
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });
      setIsMuted(!isMuted);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (resizableRef.current) {
        const newHeight = e.clientY - resizableRef.current.getBoundingClientRect().top;
        const maxHeight = 600;

        if (newHeight > maxHeight) {
          resizableRef.current.style.height = `${maxHeight}px`;
        } else if (newHeight < 200) {
          resizableRef.current.style.height = `200px`;
        } else {
          resizableRef.current.style.height = `${newHeight}px`;
        }
      }
    };

    const handleMouseDown = () => {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', () => {
        document.removeEventListener('mousemove', handleMouseMove);
      });
    };

    if (handleRef.current) {
      handleRef.current.addEventListener('mousedown', handleMouseDown);
    }

    return () => {
      if (handleRef.current) {
        handleRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, []);

  return (
    <div className='resizable-container'>
      <div ref={resizableRef} className='rtcapp-wrapper'>
        <div className='video-ui'>
          <video ref={localVideoRef} autoPlay muted />
          <video ref={remoteVideoRef} autoPlay /> 
        </div>
        <div className='call-tools'>
          <FontAwesomeIcon className='fa-icon' icon={faPhoneSlash} size="lg" alt="hangup" onClick={handleHangup} />
          <FontAwesomeIcon className='fa-icon' icon={faVolumeXmark} size="lg" alt="deafen" />
          <FontAwesomeIcon className='fa-icon' icon={faMicrophoneSlash} size="lg" alt="mute" onClick={handleMute} style={{ color: isMuted ? 'red' : 'white', transition: 'color 0.25s' }} />
        </div>
      </div>
      <div ref={handleRef} className="resizable-handle"></div>
    </div>
  );
};

export default WebRTCComponent;
