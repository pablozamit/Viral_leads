import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
const Clientes = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClientes();
  }, []);

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clients');
      const data = await response.json();
      setClientes(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleNewClient = () => {
    navigate('/clientes/new');
  };

  const handleEdit = (id) => {
    navigate(`/clientes/${id}/edit`);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Clientes</Typography>
        <Button variant="contained" color="primary" onClick={handleNewClient}>
          Nuevo cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Plataforma</TableCell>
              <TableCell>Campañas</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow key={cliente.id}>
                <TableCell>{cliente.name}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.email_platform}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to={`/campañas/${cliente.id}`}
                  >
                    Ver Campañas
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" onClick={() => handleEdit(cliente.id)}>
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Clientes;
