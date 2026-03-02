import React, { useEffect, useState } from 'react';
import { fetchWithAuth } from '../services/api'; // ahora funciona
import Navbar from './Navbar';
import AccountsList from './AccountsList';
import TransferForm from './TransferForm';
import TransactionHistory from './TransactionHistory';

// Componente StatsCards dentro del mismo archivo, pero no exportado
function StatsCards() {
  const [stats, setStats] = useState({ users: 0, accounts: 0, total_balance: 0 });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetchWithAuth('/api/stats');
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    };
    loadStats();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
      <div style={styles.card}>
        <h3>Usuarios</h3>
        <p>{stats.users}</p>
      </div>
      <div style={styles.card}>
        <h3>Cuentas</h3>
        <p>{stats.accounts}</p>
      </div>
      <div style={styles.card}>
        <h3>Saldo Total</h3>
        <p>${stats.total_balance.toFixed(2)}</p>
      </div>
    </div>
  );
}

// Componente principal Dashboard
function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('accounts');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTransferComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={styles.container}>
      <Navbar onLogout={onLogout} />
      
      <div style={styles.content}>
        {/* Puedes incluir StatsCards aquí si quieres */}
        <StatsCards />

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('accounts')}
            style={activeTab === 'accounts' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          >
            💳 Mis Cuentas
          </button>
          <button
            onClick={() => setActiveTab('transfer')}
            style={activeTab === 'transfer' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          >
            💸 Transferir
          </button>
          <button
            onClick={() => setActiveTab('history')}
            style={activeTab === 'history' ? {...styles.tab, ...styles.activeTab} : styles.tab}
          >
            📋 Historial
          </button>
        </div>

        <div style={styles.tabContent}>
          {activeTab === 'accounts' && (
            <AccountsList key={refreshKey} />
          )}
          
          {activeTab === 'transfer' && (
            <TransferForm onTransferComplete={handleTransferComplete} />
          )}
          
          {activeTab === 'history' && (
            <TransactionHistory refresh={refreshKey} />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ecf0f1'
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  card: {
    background: '#fff',
    padding: '1rem',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    flex: 1,
    textAlign: 'center'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #bdc3c7'
  },
  tab: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#7f8c8d',
    transition: 'all 0.3s ease'
  },
  activeTab: {
    color: '#2c3e50',
    // borderBottomColor: '#3498db' // opcional
  },
  tabContent: {
    minHeight: '400px'
  }
};

export default Dashboard; // único export default
