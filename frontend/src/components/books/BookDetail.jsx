import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Button, Grid, Chip, CircularProgress, Alert, Box } from '@mui/material';
import { ArrowBack, LocalLibrary } from '@mui/icons-material';
import { booksAPI, loansAPI } from '../../services/api';
import { getUserRole } from '../../utils/auth';

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const role = getUserRole();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const res = await booksAPI.getById(id);
        setBook(res.data);
      } catch (err) {
        setError('Error loading book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleBorrow = async () => {
    try {
      await loansAPI.create({ book_id: book.id });
      setMessage('✅ Book borrowed!');
      // Actualizar disponibilidad localmente o recargar
      setBook({ ...book, available_copies: book.available_copies - 1 });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!book) return <Alert severity="info">Book not found</Alert>;

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        Back
      </Button>

      {message && <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>{book.title}</Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1"><strong>ISBN:</strong> {book.isbn}</Typography>
            {book.publisher && <Typography variant="body1"><strong>Publisher:</strong> {book.publisher}</Typography>}
            {book.publication_year && <Typography variant="body1"><strong>Year:</strong> {book.publication_year}</Typography>}
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <LocalLibrary color="primary" />
              <Chip
                label={`${book.available_copies}/${book.total_copies} available`}
                color={book.available_copies > 0 ? 'success' : 'error'}
              />
            </Box>
          </Grid>
        </Grid>

        {book.description && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body2" paragraph>{book.description}</Typography>
          </Box>
        )}

        {role === 'member' && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              size="large"
              disabled={book.available_copies === 0}
              onClick={handleBorrow}
              sx={{ minWidth: 200 }}
            >
              {book.available_copies > 0 ? 'Borrow this book' : 'Not Available'}
            </Button>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookDetail;
