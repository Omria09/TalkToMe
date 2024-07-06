import React, { useEffect } from 'react';
import { Route, useNavigate } from 'react-router-dom';
import { isAuthenticated } from './auth';

/**
 * A React component that renders its children only if the user is authenticated.
 * If the user is not authenticated, it redirects them to the login page.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered if the user is authenticated.
 * @returns {React.ReactElement} - The rendered component.
 */

const PrivateRoute = ({ children }) => {
  const navigate = useNavigate();

  return isAuthenticated() ? children : navigate("/login");
};

export default PrivateRoute;
