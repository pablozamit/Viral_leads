import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

const Campañas = () => {
  const navigate = useNavigate();
  const { clienteId } = useParams();
  const [campañas, setCampañas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampañas();
  }, [clienteId, fetchCampañas]);

  const fetchCampañas = async () => {
    try {
      const response = await fetch(`/api/campaigns/${clienteId}`);
      const data = await response.json();
      setCampañas(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleNewCampaign = () => {
    navigate(`/campañas/${clienteId}/new`);
  };

  const handleEdit = (id) => {
    navigate(`/campañas/${clienteId}/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
      try {
        await fetch(`/api/campaigns/${id}`, {
          method: 'DELETE'
        });
        fetchCampañas();
      } catch (error) {
        console.error('Error deleting campaign:', error);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Campañas</Typography>
        <Button variant="contained" color="primary" onClick={handleNewCampaign}>
          <Add sx={{ mr: 1 }} />
          Nueva campaña
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha de inicio</TableCell>
              <TableCell>Fecha de fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {campañas.map((campaña) => (
              <TableRow key={campaña.id}>
                <TableCell>{campaña.name}</TableCell>
                <TableCell>{new Date(campaña.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(campaña.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {campaña.is_active ? 'Activa' : 'Inactiva'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(campaña.id)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(campaña.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Campañas;
