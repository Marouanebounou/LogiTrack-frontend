import { useState, useEffect } from 'react';
import api from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableHead,
  TableRow, TablePagination, TextField, Paper, Chip, IconButton,
  TableSortLabel, FormControlLabel, Switch, Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';

export const ProductList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [category, setCategory] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
    setPage(0);
  };

  const fetchProducts = async () => {
    try {
      const sortParam = `${sortField},${sortDir}`;
      let url = '/products';
      let params = { page, size: rowsPerPage, sort: sortParam };

      if (lowStockOnly) {
        url = '/products/low-stock';
        params = { threshold: 10, page, size: rowsPerPage, sort: sortParam };
      } else if (maxPrice && !isNaN(Number(maxPrice)) && Number(maxPrice) > 0) {
        url = `/products/price/${maxPrice}`;
        params = { page, size: rowsPerPage, sort: sortParam };
      } else if (category.trim()) {
        params.category = category.trim();
      }

      const response = await api.get(url, { params });
      setProducts(response.data.content || response.data);
      setTotalElements(response.data.totalElements || response.data.length);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, category, maxPrice, lowStockOnly, sortField, sortDir]);

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
        <Typography variant="h4" fontWeight="bold">Gestion des Produits</Typography>
        {['ADMIN', 'MANAGER'].includes(user?.role) && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/products/new')}>
            Nouveau Produit
          </Button>
        )}
      </Box>

      <Paper sx={{ p: 2, mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        <TextField
          label="Filtrer par catégorie"
          value={category}
          disabled={lowStockOnly || !!maxPrice}
          onChange={(e) => { setCategory(e.target.value); setPage(0); }}
        />
        <TextField
          label="Prix max (DH)"
          type="number"
          value={maxPrice}
          disabled={lowStockOnly}
          sx={{ width: 160 }}
          slotProps={{ htmlInput: { min: 0 } }}
          onChange={(e) => { setMaxPrice(e.target.value); setPage(0); }}
        />
        {["ADMIN","MANAGER"].includes(user?.role) && (
          <FormControlLabel
            control={
              <Switch
                checked={lowStockOnly}
                onChange={(e) => { setLowStockOnly(e.target.checked); setPage(0); }}
                color="warning"
              />
            }
            label="Stock faible (≤10)"
          />
        )}
      </Paper>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell><SortLabel field="name" label="Libéllé" /></TableCell>
              <TableCell>Catégorie</TableCell>
              <TableCell><SortLabel field="price" label="Prix (DH)" /></TableCell>
              <TableCell><SortLabel field="quantity" label="Stock" /></TableCell>
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
                  <Tooltip title="Voir les détails">
                    <IconButton onClick={() => navigate(`/products/${product.id}`)}>
                      <VisibilityIcon color="action" />
                    </IconButton>
                  </Tooltip>
                  {['ADMIN', 'MANAGER'].includes(user?.role) && (
                    <Tooltip title="Modifier">
                      <IconButton onClick={() => navigate(`/products/edit/${product.id}`)}>
                        <EditIcon color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {user?.role === 'ADMIN' && (
                    <Tooltip title="Supprimer">
                      <IconButton onClick={() => handleDelete(product.id)}>
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