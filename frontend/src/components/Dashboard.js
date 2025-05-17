import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Panel de Control
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Clientes
              </Typography>
              <Typography variant="h3" gutterBottom>
                12
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate('/clientes')}
              >
                Ver Clientes
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Campañas Activas
              </Typography>
              <Typography variant="h3" gutterBottom>
                24
              </Typography>
              <Button variant="contained">
                Crear Campaña
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Leads Totales
              </Typography>
              <Typography variant="h3" gutterBottom>
                542
              </Typography>
              <Button variant="contained">
                Ver Leads
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Invitaciones
              </Typography>
              <Typography variant="h3" gutterBottom>
                1,234
              </Typography>
              <Button variant="contained">
                Ver Estadísticas
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
