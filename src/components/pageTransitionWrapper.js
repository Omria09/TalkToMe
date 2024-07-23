// PageTransitionWrapper.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles.css'; // Ensure this includes the animations

const PageTransitionWrapper = ({ children }) => {
  const location = useLocation(); // Get the current location
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    // Add fade-out class when location changes
    setAnimationClass('fade-out');

    // Remove fade-out class after animation duration
    const timer = setTimeout(() => {
      setAnimationClass('');
    }, 500); // Match the duration of your animation

    return () => clearTimeout(timer);
  }, [location]);

  return (
    <div id="root" className={animationClass}>
      {children}
    </div>
  );
};

export default PageTransitionWrapper;
