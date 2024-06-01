import * as React from 'react';
import { createRoot } from 'react-dom/client';
import Home from './components/Home.jsx';
import './index.css'
const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<Home />);