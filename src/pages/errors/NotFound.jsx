import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <Typography variant="h1" fontWeight="bold" color="primary">404</Typography>
        <Typography variant="h5" gutterBottom>Page non trouvée</Typography>
        <Typography color="textSecondary" mb={4}>
          La page que vous recherchez n'existe pas ou a été déplacée.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </Button>
      </Box>
    </Container>
  );
};