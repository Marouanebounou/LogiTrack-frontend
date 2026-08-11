import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import {
  Box, Typography, Paper, Button, Grid, Chip, CircularProgress,
  Table, TableHead, TableRow, TableCell, TableBody
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const STATUS_COLOR = { LIVREE: 'success', EXPEDIEE: 'info', EN_ATTENTE: 'warning' };

export const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [productsMap, setProductsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, productsRes] = await Promise.all([
          api.get(`/commandes/${id}`),
          api.get('/products', { params: { size: 1000 } }),
        ]);
        setOrder(orderRes.data);
        const map = {};
        (productsRes.data.content || productsRes.data).forEach((p) => {
          map[p.id] = p;
        });
        setProductsMap(map);
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

  const total =
    order?.ligneCommandes?.reduce((sum, l) => {
      const price = productsMap[l.productId]?.price || 0;
      return sum + price * l.quantity;
    }, 0) || 0;

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')}>
          Retour
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Détails de la Commande #{id}
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Informations générales
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography color="textSecondary" variant="body2">Client</Typography>
            <Button
              size="small"
              sx={{ p: 0, minWidth: 0 }}
              onClick={() => navigate(`/clients/${order?.clientId}`)}
            >
              Client #{order?.clientId}
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="textSecondary" variant="body2">Date</Typography>
            <Typography fontWeight="medium">
              {order?.dateCommande
                ? new Date(order.dateCommande).toLocaleString('fr-FR')
                : '—'}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography color="textSecondary" variant="body2">Statut</Typography>
            <Chip
              label={order?.statutCommande}
              color={STATUS_COLOR[order?.statutCommande] || 'default'}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Articles ({order?.ligneCommandes?.length || 0})
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Produit</TableCell>
              <TableCell>Prix Unitaire</TableCell>
              <TableCell>Quantité</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order?.ligneCommandes?.map((ligne) => {
              const product = productsMap[ligne.productId];
              return (
                <TableRow key={ligne.id}>
                  <TableCell>{product?.name || `Produit #${ligne.productId}`}</TableCell>
                  <TableCell>{product?.price ?? '—'} DH</TableCell>
                  <TableCell>{ligne.quantity}</TableCell>
                  <TableCell align="right">
                    {product ? product.price * ligne.quantity : '—'} DH
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow>
              <TableCell colSpan={3} align="right">
                <Typography fontWeight="bold">Total commande</Typography>
              </TableCell>
              <TableCell align="right">
                <Typography fontWeight="bold" color="primary.main">
                  {total} DH
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};
