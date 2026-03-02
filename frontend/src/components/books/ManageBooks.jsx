// src/components/books/ManageBooks.jsx
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  TablePagination, Box
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { booksAPI } from '../../services/api';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    isbn: '', title: '', author: '', publisher: '',
    publication_year: '', total_copies: 1, description: ''
  });
  const [message, setMessage] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalBooks, setTotalBooks] = useState(0);

  useEffect(() => {
    fetchBooks();
  }, [page, rowsPerPage]);

  const fetchBooks = async () => {
    try {
      // Asumimos que la API acepta page y limit (page empieza en 1)
      const res = await booksAPI.getAll({ page: page + 1, limit: rowsPerPage });
      setBooks(res.data.books);
      setTotalBooks(res.data.total || 0);
    } catch (err) {
      setMessage('Error loading books');
    }
  };

  const handleOpen = (book = null) => {
    if (book) {
      setEditingBook(book);
      setFormData(book);
    } else {
      setEditingBook(null);
      setFormData({
        isbn: '', title: '', author: '', publisher: '',
        publication_year: '', total_copies: 1, description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBook(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await booksAPI.update(editingBook.id, formData);
        setMessage('✅ Book updated');
      } else {
        await booksAPI.create(formData);
        setMessage('✅ Book created');
      }
      fetchBooks();
      handleClose();
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error'}`);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await booksAPI.delete(id);
        setMessage('✅ Book deleted');
        fetchBooks();
      } catch (err) {
        setMessage(`❌ ${err.response?.data?.message || 'Error'}`);
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📚 Manage Books</Typography>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpen()}
        sx={{ mb: 2 }}
      >
        Add Book
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ISBN</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Publisher</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Copies</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map(book => (
              <TableRow key={book.id}>
                <TableCell>{book.isbn}</TableCell>
                <TableCell>{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>{book.publisher}</TableCell>
                <TableCell>{book.publication_year}</TableCell>
                <TableCell>{book.available_copies}/{book.total_copies}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpen(book)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(book.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={totalBooks}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Books per page"
      />

      {/* Dialog para añadir/editar (igual que antes) */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingBook ? 'Edit Book' : 'Add Book'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="ISBN"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Publisher"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Publication Year"
            name="publication_year"
            type="number"
            value={formData.publication_year}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Total Copies"
            name="total_copies"
            type="number"
            value={formData.total_copies}
            onChange={handleChange}
            margin="normal"
            InputProps={{ inputProps: { min: 1 } }}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={3}
            value={formData.description}
            onChange={handleChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageBooks;
