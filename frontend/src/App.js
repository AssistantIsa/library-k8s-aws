import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import BookList from './components/books/BookList';
import MyLoans from './components/loans/MyLoans';
import ManageBooks from './components/books/ManageBooks';
import BookDetail from './components/books/BookDetail';

const theme = createTheme({ palette: { primary: { main: '#1976d2' } } });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
            <Route path="/books" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
            <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />            
	    <Route path="/my-loans" element={<ProtectedRoute><MyLoans /></ProtectedRoute>} />
            <Route path="/manage-books" element={<ProtectedRoute allowedRoles={['admin', 'librarian']}><ManageBooks /></ProtectedRoute>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
