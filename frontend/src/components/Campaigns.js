import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Campaigns = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const response = await axios.get('/api/campaigns');
      setCampaigns(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  };

  const handleCreate = () => {
    navigate('/campaigns/new');
  };

  const handleEdit = (id) => {
    navigate(`/campaigns/${id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta campaña?')) {
      try {
        await axios.delete(`/api/campaigns/${id}`);
        fetchCampaigns();
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
        <Button variant="contained" color="primary" onClick={handleCreate}>
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
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell>{campaign.name}</TableCell>
                <TableCell>{new Date(campaign.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(campaign.end_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {campaign.is_active ? 'Activa' : 'Inactiva'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(campaign.id)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(campaign.id)} color="error">
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

export default Campaigns;
