import React, { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const NewClient = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    email_platform: 'wildmail',
    platform_api_key: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          user_id: user.id
        })
      });
      
      if (!response.ok) {
        throw new Error('Error al crear el cliente');
      }
      
      navigate('/clientes');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5">
            Nuevo Cliente
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nombre del Cliente"
              name="name"
              autoComplete="name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Plataforma de Email Marketing</InputLabel>
              <Select
                name="email_platform"
                value={formData.email_platform}
                onChange={handleChange}
                label="Plataforma de Email Marketing"
              >
                <MenuItem value="wildmail">Wildmail</MenuItem>
                <MenuItem value="activecampaign">ActiveCampaign</MenuItem>
                <MenuItem value="systeme">Systeme</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="platform_api_key"
              label="API Key de la Plataforma"
              name="platform_api_key"
              autoComplete="off"
              value={formData.platform_api_key}
              onChange={handleChange}
            />
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Crear Cliente
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default NewClient;
