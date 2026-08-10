import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Container, Paper, Typography, TextField, Button, Box, Grid } from '@mui/material';

const schema = yup.object({
  name: yup.string().required('Le nom du produit est obligatoire'),
  category: yup.string().required('La catégorie est obligatoire'),
  price: yup
    .number()
    .typeError('Le prix doit être un nombre')
    .positive('Le prix doit être supérieur à zéro')
    .required('Le prix est obligatoire'),
  quantity: yup
    .number()
    .typeError('Le stock doit être un nombre')
    .min(0, 'Le stock ne peut pas être négatif')
    .required('Le stock est obligatoire'),
});

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/products/${id}`)
        .then((res) => reset(res.data))
        .catch((err) => console.error('Erreur lors du chargement du produit:', err));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await api.put(`/products/${id}`, data);
      } else {
        await api.post('/products', data);
      }
      navigate('/products');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du produit:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          {isEdit ? 'Modifier le Produit' : 'Nouveau Produit'}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom du Produit"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Catégorie"
                {...register('category')}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Prix (DH)"
                {...register('price')}
                error={!!errors.price}
                helperText={errors.price?.message}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Stock Quantité"
                {...register('quantity')}
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={() => navigate('/products')}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Enregistrer
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};