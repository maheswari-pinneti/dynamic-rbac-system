import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const Logout = () => {
  const { logout, currentUser } = useAuth();
  const { info } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    info('You have been signed out.', 'Signed Out');
    navigate('/login', { replace: true });
  }, [logout, navigate, info]);

  return null;
};

export default Logout;
