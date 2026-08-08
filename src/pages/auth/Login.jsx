import * as yup from 'yup'
import { useAuth } from '../../context/AuthContext'
import { data, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const schema = yup.object({
    email: yup.string().email("Format email invalide").required('L\'email est obligatoire'),
    password: yup.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères').required('Le mot de passe est obligatoire'),
})

export const LoginPage = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("")

    const { register , handleSubmit , formState: {errors , isSubmiting} } = useForm({
        resolver: yupResolver(schema),
    }) 

    const onSubmit = async (data) => {
        try {
            setErrorMsg('')
            await login(data.email , data.password);
            navigate("/dashboard");
        } catch (error) {
            setErrorMsg('Email ou mot de passe incorrect.')
        }
    }

    return(
        <Container maxWidth="xs">
            <Box sx={{margingTop: 8 , display: 'flex' , flexDirection: 'column' , alignItems: 'center'}}>
                <Typography component='h1' variant='h5'>Connexion LogiTrack</Typography>
                {errorMsg && <Alert severity='error' sx={{width: '100%' , mt: 2}}>{errorMsg}</Alert>}
                
                <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
                    <TextField 
                        margin='"normal'
                        fullWidth
                        label="Adress Email"
                        {...register('email')}
                        error={!!errors.email}
                        helperText={errors.email.message}
                    />
                    <TextField 
                        margin='"normal'
                        fullWidth
                        type='password'
                        label="Password"
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password.message}
                    />
                    <Button 
                        type='submit'
                        fullWidth
                        variant='contained'
                        disabled={isSubmiting}
                        sx={{mt:3,mb:2}}
                    >
                        Se connecter
                    </Button>   
                    <Box>
                        <Link component={RouterLink} to="/register" variant="body2">
                            Pas encore de compte ? S'inscrire
                        </Link>
                    </Box>
                </Box>
            </Box>
        </Container>
    )
}