import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Container, Paper, Typography, TextField, Button, Box, Grid, MenuItem } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const schema = yup.object({
  nom: yup.string().required('Le prénom est obligatoire'),
  prenom: yup.string().required('Le nom est obligatoire'),
  number: yup.number().required('Le Numero est obligatoire'),
  email: yup.string().email('Email invalide').required('L\'email est obligatoire'),
  password: yup.string().min(6, 'Minimum 6 caractères').required('Le mot de passe est obligatoire'),
  role: yup.string().oneOf(['ADMIN', 'MANAGER', 'AGENT'], 'Rôle invalide').required('Le rôle est obligatoire'),
});

export const UserForm = () => {
    const navigate = useNavigate();
    const {user} = useAuth()
    
    if(["MANAGER" , "AGENT"].includes(user?.role)){
      window.location.href = "/access-denied"
    }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { role: 'AGENT' },
  });

  const onSubmit = async (data) => {
    try {
      await api.post('/auth/register', data);
      navigate('/users');
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">
          Ajouter un Utilisateur
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Prénom" {...register('nom')}
                error={!!errors.nom} helperText={errors.nom?.message}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth label="Nom" {...register('prenom')}
                error={!!errors.prenom} helperText={errors.prenom?.message}
              />
            </Grid>
            <Grid>
                <TextField
                    fullWidth label="Number" {...register('number')}
                    error={!!errors.number} helperText={errors.number?.message}
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
                fullWidth type="password" label="Mot de passe" {...register('password')}
                error={!!errors.password} helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select fullWidth label="Rôle" defaultValue="AGENT" {...register('role')}
                error={!!errors.role} helperText={errors.role?.message}
              >
                <MenuItem value="AGENT">AGENT</MenuItem>
                <MenuItem value="MANAGER">MANAGER</MenuItem>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
            <Button variant="outlined" onClick={() => navigate('/users')}>
              Annuler
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              Créer l'utilisateur
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};