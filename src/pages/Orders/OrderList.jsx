import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import {
  Box, Typography, Table, TableBody, TableCell, TableHead,
  TableRow, Paper, Chip, MenuItem, Select, FormControl, InputLabel,
  Button, Tooltip, IconButton, TablePagination, TableSortLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const STATUSES = ['EN_ATTENTE', 'EXPEDIEE', 'LIVREE'];
const STATUS_COLOR = { LIVREE: 'success', EXPEDIEE: 'info', EN_ATTENTE: 'warning' };

export const OrderList = () => {
  const navigate = useNavigate()
  const {user} = useAuth()
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [sortField, setSortField] = useState('dateCommande');
  const [sortDir, setSortDir] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const fetchOrders = async () => {
    try {
      const response = await api.get('/commandes', {
        params: {
          status: statusFilter || undefined,
          page,
          size: rowsPerPage,
          sort: `${sortField},${sortDir}`,
        },
      });
      setOrders(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, page, rowsPerPage, sortField, sortDir]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.patch(`/commandes/${orderId}/status/${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette commande ?')) {
      try {
        await api.delete(`/commandes/${id}`);
        fetchOrders();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  const SortLabel = ({ field, label }) => (
    <TableSortLabel
      active={sortField === field}
      direction={sortField === field ? sortDir : 'asc'}
      onClick={() => handleSort(field)}
    >
      {label}
    </TableSortLabel>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Gestion des Commandes</Typography>
        {['ADMIN', 'MANAGER'].includes(user?.role) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/orders/new')}>
            Nouvelle Commande
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filtrer par Statut</InputLabel>
          <Select
            value={statusFilter}
            label="Filtrer par Statut"
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
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
              <TableCell><SortLabel field="dateCommande" label="Date" /></TableCell>
              <TableCell><SortLabel field="statutCommande" label="Statut" /></TableCell>
              <TableCell align="center">Changer le Statut</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>#{order.id}</TableCell>
                <TableCell>{order.clientId}</TableCell>
                <TableCell>
                  {order.dateCommande
                    ? new Date(order.dateCommande).toLocaleDateString('fr-FR')
                    : '—'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={order.statutCommande}
                    color={STATUS_COLOR[order.statutCommande] || 'default'}
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
                <TableCell align="center">
                  <Tooltip title="Voir les détails">
                    <IconButton onClick={() => navigate(`/orders/${order.id}`)}>
                      <VisibilityIcon color="action" />
                    </IconButton>
                  </Tooltip>
                  {['ADMIN', 'MANAGER'].includes(user?.role) && (
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => handleDelete(order.id)}>
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={totalElements}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};