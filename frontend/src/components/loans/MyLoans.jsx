import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Button, Chip, Alert, CircularProgress, Box
} from '@mui/material';
import { loansAPI } from '../../services/api';

const MyLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const res = await loansAPI.getMyLoans();
      setLoans(res.data);
    } catch (err) {
      setError('Error loading loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId) => {
    try {
      await loansAPI.returnBook(loanId);
      setMessage('✅ Book returned successfully');
      fetchLoans();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(`❌ ${err.response?.data?.message || 'Error returning book'}`);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>📚 My Loans</Typography>

      {message && (
        <Alert severity={message.includes('✅') ? 'success' : 'error'} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loans.length === 0 ? (
        <Alert severity="info">No active loans</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book ID</TableCell>
                <TableCell>Loan Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>{loan.book_id}</TableCell>
                  <TableCell>{new Date(loan.loan_date).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(loan.due_date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={loan.status}
                      color={loan.status === 'active' ? 'primary' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>${loan.fine_amount.toFixed(2)}</TableCell>
                  <TableCell>
                    {loan.status === 'active' && (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default MyLoans;
