import { Container, Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import BlockIcon from '@mui/icons-material/Block';

export const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box textAlign="center" mt={10}>
        <BlockIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
        <Typography variant="h3" fontWeight="bold" gutterBottom>403 - Accès Refusé</Typography>
        <Typography color="textSecondary" mb={4}>
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </Typography>
        <Button variant="contained" onClick={() => navigate('/dashboard')}>
          Retour au tableau de bord
        </Button>
      </Box>
    </Container>
  );
};