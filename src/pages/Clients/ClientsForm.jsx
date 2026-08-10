import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Container, Paper, Typography, TextField, Button, Box, Grid } from '@mui/material';

const schema = yup.object({
  nom: yup.string().required('Le nom est obligatoire'),
  prenom: yup.string().required('Le prénom est obligatoire'),
  email: yup.string().email('Email invalide').required('L\'email est obligatoire'),
  number: yup.string().required('Le téléphone est obligatoire'),
});

export const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isEdit) {
      api.get(`/users/${id}`).then((res) => {
        reset(res.data);
      }).catch((err) => console.error(err));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await api.put(`/users/${id}`, data);
      } else {
        await api.post('/users/client/new', data);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" mb={3}>
          {isEdit ? 'Modifier le Client' : 'Ajouter un Client'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Nom" {...register('nom')}
                error={!!errors.nom} helperText={errors.nom?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Prénom" {...register('prenom')}
                error={!!errors.prenom} helperText={errors.prenom?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Email" {...register('email')}
                error={!!errors.email} helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth label="Téléphone" {...register('number')}
                error={!!errors.number} helperText={errors.number?.message}
              />
            </Grid>
          </Grid>
          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={() => navigate('/clients')}>Annuler</Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>Enregistrer</Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};