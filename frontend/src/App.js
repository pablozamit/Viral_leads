import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Campañas from './components/Campañas';
import Leads from './components/Leads';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './utils/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/clientes"
            element={
              <ProtectedRoute>
                <Clientes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campañas/:clienteId"
            element={
              <ProtectedRoute>
                <Campañas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads/:campañaId"
            element={
              <ProtectedRoute>
                <Leads />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
