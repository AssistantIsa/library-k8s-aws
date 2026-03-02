// src/components/AccountsList.js

import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { fetchWithAuth } from '../services/api';

function AccountsList() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await api.getAccounts();
      //const data = await getAccounts();	    
      if (data.accounts) {
        setAccounts(data.accounts);
      } else {
        setError('Error al cargar cuentas');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    const res = await fetchWithAuth('/api/accounts');
    const data = await res.json();
    setAccounts(data.accounts || []);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) return <div style={styles.loading}>Cargando cuentas...</div>;
  if (error) return <div style={styles.error}>{error}</div>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💳 Mis Cuentas</h3>
      <div style={styles.accountsGrid}>
        {accounts.map(account => (
          <div key={account.account_number} style={styles.accountCard}>
            <div style={styles.accountHeader}>
              <span style={styles.accountType}>{account.account_type}</span>
              <span style={styles.accountNumber}>
                N° {account.account_number}
              </span>
            </div>
            <div style={styles.balance}>
              {formatCurrency(account.balance)}
            </div>
            <div style={styles.accountFooter}>
              <span style={styles.status}>
                {account.is_active ? '✅ Activa' : '❌ Inactiva'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '1rem'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '1rem'
  },
  accountsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1rem'
  },
  accountCard: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  accountHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  accountType: {
    fontWeight: 'bold',
    color: '#3498db'
  },
  accountNumber: {
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  balance: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: '1rem'
  },
  accountFooter: {
    borderTop: '1px solid #ecf0f1',
    paddingTop: '0.5rem'
  },
  status: {
    fontSize: '0.9rem',
    color: '#7f8c8d'
  },
  loading: {
    textAlign: 'center',
    padding: '2rem',
    color: '#7f8c8d'
  },
  error: {
    textAlign: 'center',
    padding: '2rem',
    color: '#e74c3c'
  }
};

export default AccountsList;
