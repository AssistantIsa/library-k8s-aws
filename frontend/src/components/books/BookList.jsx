// src/components/books/BookList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Card, CardContent, CardActions, CardActionArea,
  Typography, Button, TextField, Box, Chip, CircularProgress,
  Alert, InputAdornment, MenuItem, Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { booksAPI, loansAPI } from '../../services/api';
import { getUserRole } from '../../utils/auth';

const BookList = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [message, setMessage] = useState('');
  const role = getUserRole();
  
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 12, search };
      
      // CRÍTICO: Solo agregar language si tiene valor
      if (language) {
        params.language = language;
      }
      
      console.log('Fetching with params:', params); // Debug
      
      const res = await booksAPI.getAll(params);
      setBooks(res.data.books || []);
      setTotalPages(res.data.pages || 1);
    } catch (err) {
      setError('Error loading books');
    } finally {
      setLoading(false);
    }
  }, [page, search, language]);
  
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleBorrow = async (bookId, e) => {
    e.stopPropagation(); // Evita navegar al detalle
    try {
      await loansAPI.create({ book_id: bookId });
      setMessage('✅ Book borrowed!');
      fetchBooks(); // Refresca para actualizar disponibilidad
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📚 Library Catalog</Typography>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {/* Filtros: Búsqueda e Idioma */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          placeholder="Search by title, author or ISBN..."
          value={search}
          onChange={(e) => { setPage(1); setSearch(e.target.value); }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>
          }}
          sx={{ flex: 2, minWidth: 250 }}
        />
        <TextField
          select
          label="Language"
          value={language}
          onChange={(e) => { setPage(1); setLanguage(e.target.value); }}
          sx={{ minWidth: 150 }}
        >
	  <MenuItem value="">All Languages</MenuItem>
          <MenuItem value="en">🇬🇧 English ({2223})</MenuItem>
          <MenuItem value="es">🇪🇸 Español ({14295})</MenuItem>
          <MenuItem value="fr">🇫🇷 Français ({10129})</MenuItem>
          <MenuItem value="de">🇩🇪 Deutsch ({12412})</MenuItem>
          <MenuItem value="it">🇮🇹 Italiano ({12616})</MenuItem>
          <MenuItem value="pt">🇵🇹 Português ({894})</MenuItem>
        </TextField>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <Grid container spacing={3}>
            {books.map(book => (
              <Grid item xs={12} sm={6} md={4} key={book.id}>
                <Card>
                  <CardActionArea onClick={() => navigate(`/books/${book.id}`)}>
                    <CardContent>
                      <Typography variant="h6" noWrap>{book.title}</Typography>
                      <Typography color="text.secondary" gutterBottom>
                        {book.author}
                      </Typography>
                      <Typography variant="body2">ISBN: {book.isbn}</Typography>
                      {book.publisher && (
                        <Typography variant="body2" color="text.secondary">
                          Publisher: {book.publisher}
                        </Typography>
                      )}
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={`${book.available_copies}/${book.total_copies} available`}
                          color={book.available_copies > 0 ? 'success' : 'error'}
                          size="small"
                        />
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  {role === 'member' && (
                    <CardActions>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={book.available_copies === 0}
                        onClick={(e) => handleBorrow(book.id, e)}
                        fullWidth
                      >
                        {book.available_copies > 0 ? 'Borrow' : 'Not Available'}
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
          {/* Paginación */}
          {totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}

          {books.length === 0 && (
            <Alert severity="info">No books found</Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default BookList;
