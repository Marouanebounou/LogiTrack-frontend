import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableHead,
  TableRow, TablePagination, TextField, Paper, Chip, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products', {
        params: {
          page: page,
          size: rowsPerPage,
          category: category.trim() || null,
          sort: 'name',
        },
      });
      setProducts(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, category]);

  const handleDelete = async (id) => {
    if (window.confirm('Voulez-vous supprimer ce produit ?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
      }
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">Gestion des Produits</Typography>
        {['ADMIN', 'MANAGER'].includes(user?.role) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/products/new')}>
            Nouveau Produit
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Filtrer par catégorie"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(0);
          }}
        />
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Libellé</TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell>Prix (DH)</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>#{product.id}</TableCell>
                <TableCell>{product.name }</TableCell>
                <TableCell>{product.category }</TableCell>
                <TableCell>{product.price} DH</TableCell>
                <TableCell>
                  <Chip
                    label={product.quantity}
                    color={product.quantity <= 5 ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="center">
                  {['ADMIN', 'MANAGER'].includes(user?.role) && (
                    <IconButton onClick={() => navigate(`/products/edit/${product.id}`)}>
                      <EditIcon color="primary" />
                    </IconButton>
                  )}
                  {user?.role === 'ADMIN' && (
                    <IconButton onClick={() => handleDelete(product.id)}>
                      <DeleteIcon color="error" />
                    </IconButton>
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
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </Paper>
    </Box>
  );
};