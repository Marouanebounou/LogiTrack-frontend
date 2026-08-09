import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import * as yup from "yup";
import api from "../../api/axiosInstance";

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const schema = yup.object({
    email: yup.string().email("Format email invalide").required('L\'email est obligatoire'),
    password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est obligatoire'),
    nom: yup.string().required('Le nom est obligatoire'),
    prenom: yup.string().required('Le prénom est obligatoire'),
    number: yup.string().required('Le numéro de téléphone est obligatoire').min(10, 'Le numéro doit avoir au moins 10 chiffres').max(12, 'Le numéro doit avoir au plus 12 chiffres')
});

export const RegisterPage = () => {
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema)
    });

    const onSubmit = async (data) => {
        try {
            setErrorMsg('');
            await api.post("/auth/register", data);
            navigate("/login");
        } catch (error) {
            setErrorMsg(error.response?.data?.message || "Internal server error");
        }
    };

    return (
        <Container maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component='h1' variant='h5'>Inscription LogiTrack</Typography>
                {errorMsg && <Alert severity='error' sx={{ width: '100%', mt: 2 }}>{errorMsg}</Alert>}
                
                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                    <TextField 
                        margin="normal"
                        fullWidth
                        label="Nom"
                        {...register('nom')}
                        error={!!errors.nom}
                        helperText={errors.nom?.message}
                    />
                    <TextField 
                        margin="normal"
                        fullWidth
                        label="Prénom"
                        {...register('prenom')}
                        error={!!errors.prenom}
                        helperText={errors.prenom?.message}
                    />
                    <TextField 
                        margin="normal"
                        fullWidth
                        label="Adresse Email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField 
                        margin="normal"
                        fullWidth
                        label="Numéro de téléphone"
                        {...register('number')}
                        error={!!errors.number}
                        helperText={errors.number?.message}
                    />
                    <TextField 
                        margin="normal"
                        fullWidth
                        type='password'
                        label="Mot de passe"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Button 
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={isSubmitting}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        S'inscrire
                    </Button>   
                    <Box sx={{ textAlign: 'center' }}>
                        <Link component={RouterLink} to="/login" variant="body2">
                            Déjà un compte ? Se connecter
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};  