import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth';


const PrivateRoute = ({ children }) => {
    const navigate = useNavigate();

    return isAuthenticated() ? children : navigate('/login');;
  };

export default PrivateRoute;
