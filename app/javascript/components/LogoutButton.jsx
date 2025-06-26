import React from 'react';
import { logout } from '../api';

const LogoutButton = ({ onLogoutSuccess }) => {
  const handleLogout = async () => {
    try {
      await logout();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;