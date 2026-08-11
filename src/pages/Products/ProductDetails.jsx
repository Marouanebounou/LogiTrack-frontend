import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import {
  Box, Typography, Paper, Button, Grid, Chip, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../context/AuthContext';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error('Erreur lors du chargement:', err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/products')}>
          Retour
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Détails du Produit
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
          <Typography variant="h6" fontWeight="bold">Informations du produit</Typography>
          {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/products/edit/${id}`)}
            >
              Modifier
            </Button>
          )}
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Libellé</Typography>
            <Typography fontWeight="medium" variant="h6">{product?.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Catégorie</Typography>
            <Chip label={product?.category} size="small" color="primary" variant="outlined" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Prix</Typography>
            <Typography fontWeight="bold" variant="h5" color="primary.main">
              {product?.price} DH
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Stock disponible</Typography>
            <Chip
              label={`${product?.quantity} unités`}
              color={product?.quantity <= 5 ? 'error' : 'success'}
              size="medium"
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
