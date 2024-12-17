import React, { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  exp: number; // Token expiration time in seconds since Unix epoch
}

interface PrivateRouteProps {
  element: ReactElement; // Represents the component to render
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const token = localStorage.getItem('token');

  const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;

    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp < currentTime;
    } catch (error) {
      return true; // If there's an error in decoding, consider the token as expired
    }
  };

  const isAuthenticated = token && !isTokenExpired(token);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
