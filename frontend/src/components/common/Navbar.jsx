import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getUserRole } from '../../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const role = getUserRole();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/')}>
          📚 Library System
        </Typography>
        {user && (
          <Box>
            <Button color="inherit" onClick={() => navigate('/books')}>Books</Button>
            <Button color="inherit" onClick={() => navigate('/my-loans')}>My Loans</Button>
            {(role === 'admin' || role === 'librarian') && (
              <Button color="inherit" onClick={() => navigate('/manage-books')}>Manage Books</Button>
            )}
            <Typography component="span" sx={{ mx: 2 }}>{user.username} ({role})</Typography>
            <Button color="inherit" onClick={logout}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
