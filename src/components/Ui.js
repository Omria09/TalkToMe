import React, { useEffect } from 'react';

export default function Ui() {
  useEffect(() => {
    const minimizeButton = document.getElementById('minimize');
    const closeButton = document.getElementById('close-app');
    const fullscreenButton = document.getElementById('fullscreen');

    const handleFullscreen = () => {
      window.electron.fullScreenWindow();
    }
    const handleMinimize = () => {
      window.electron.minimizeWindow();
    };

    const handleClose = () => {
      window.electron.closeWindow();
    };

    minimizeButton.addEventListener('click', handleMinimize);
    fullscreenButton.addEventListener('click', handleFullscreen);
    closeButton.addEventListener('click', handleClose);

    // Clean up event listeners on component unmount
    return () => {
      minimizeButton.removeEventListener('click', handleMinimize);
      closeButton.removeEventListener('click', handleClose);
      closeButton.removeEventListener('click', handleFullscreen);
    };
  }, []);

  return (
    <>
        <nav className='ui-nav'>
          <div className="left-nav">
            {/* <span className="nav-link">&#x2630;</span> */}
            <span className="nav-title">TalkToMe</span>
          </div>
          <div className="right-nav">
            <span className="nav-link" id="minimize">&minus;</span>
            <span className="nav-link" id="fullscreen">&#10064;</span>
            <span className="nav-link cursor-pointer text-red-600" id="close-app">&#10006;</span>
          </div>
        </nav>
    </>
  );
}
