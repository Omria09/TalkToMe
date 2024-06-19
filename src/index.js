import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.js';

const domNode = document.getElementById('root');
const root = createRoot(domNode);

window.addEventListener('mousedown', (event) => {
    if (event.button === 1) {  // Middle mouse button is usually represented by button code 1
        console.log("clicked");
      event.preventDefault();  // Prevent the default action
    }
});

root.render(<App />);