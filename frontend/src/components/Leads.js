import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import { Visibility, Delete } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const Leads = () => {
  const { campañaId } = useParams();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [campañaId, fetchLeads]);

  const fetchLeads = async () => {
    try {
      const response = await fetch(`/api/leads/${campañaId}`);
      const data = await response.json();
      setLeads(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
  };

  const handleView = (lead) => {
    // Implementar vista detallada del lead
    console.log('Ver detalles del lead:', lead);
  };

  const handleDelete = async (leadId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este lead?')) {
      try {
        await fetch(`/api/leads/${leadId}`, {
          method: 'DELETE'
        });
        fetchLeads();
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Leads</Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Nombre</TableCell>
              <TableCell>Código de referencia</TableCell>
              <TableCell>Nº de referidos</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.referral_code}</TableCell>
                <TableCell>{lead.referral_count}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleView(lead)} color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(lead.id)} color="error">
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

export default Leads;
