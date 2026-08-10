import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, Paper, Chip, MenuItem, Select, FormControl, InputLabel,
  Button
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STATUSES = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE'];

export const OrderList = () => {
  const navigate = useNavigate()
  const {user} = useAuth()
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const response = await api.get('/commandes', {
        params: { status: statusFilter || undefined }
      });
      setOrders(response.data.content || response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/commandes/${orderId}/status/${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>Gestion des Commandes</Typography>
        {['ADMIN', 'MANAGER'].includes(user?.role) && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/orders/new')}>
              Nouveau Commande
            </Button>
        )}

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Filtrer par Statut"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tous les statuts</MenuItem>
            {STATUSES.map((st) => (
              <MenuItem key={st} value={st}>{st}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Client Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Statut Actuel</TableCell>
              <TableCell align="center">Changer le Statut</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.clientId}</TableCell>
                <TableCell>{order.dateCommande}</TableCell>
                <TableCell>
                  <Chip
                    label={order.statutCommande}
                    color={
                      order.statutCommande === 'LIVREE' ? 'success' :
                      order.statutCommande === 'EXPEDIEE' ? 'info' : 'warning'
                    }
                  />
                </TableCell>
                <TableCell align="center">
                  <Select
                    size="small"
                    value={order.statutCommande}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  >
                    {STATUSES.map((st) => (
                      <MenuItem key={st} value={st}>{st}</MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};