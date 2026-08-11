import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import {
  Box, Typography, Paper, Button, Grid, Chip, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../context/AuthContext';

const STATUS_COLOR = { LIVREE: 'success', EXPEDIEE: 'info', EN_ATTENTE: 'warning' };

export const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientRes, ordersRes] = await Promise.all([
          api.get(`/users/${id}`),
          api.get(`/commandes/client/${id}`),
        ]);
        setClient(clientRes.data);
        setOrders(ordersRes.data.content || ordersRes.data);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/clients')}>
          Retour
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Détails du Client
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Typography variant="h6" fontWeight="bold">Informations personnelles</Typography>
          {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/clients/edit/${id}`)}
            >
              Modifier
            </Button>
          )}
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Nom</Typography>
            <Typography fontWeight="medium">{client?.nom}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Prénom</Typography>
            <Typography fontWeight="medium">{client?.prenom}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Email</Typography>
            <Typography fontWeight="medium">{client?.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Téléphone</Typography>
            <Typography fontWeight="medium">{client?.number}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary" variant="body2">Rôle</Typography>
            <Chip label={client?.role} size="small" color="info" />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Commandes ({orders.length})
        </Typography>
        {orders.length === 0 ? (
          <Typography color="textSecondary">Aucune commande trouvée.</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    {order.dateCommande
                      ? new Date(order.dateCommande).toLocaleDateString('fr-FR')
                      : '—'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.statutCommande}
                      color={STATUS_COLOR[order.statutCommande] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Button size="small" onClick={() => navigate(`/orders/${order.id}`)}>
                      Voir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
};
