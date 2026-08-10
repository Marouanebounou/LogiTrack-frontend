import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { Container, Paper, Typography, MenuItem, Button, Box, Grid, TextField, Table, TableHead, TableRow, TableCell, TableBody, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const OrderForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedClient, setSelectedClient] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/users/role/Client').then(res => setClients(res.data.content || res.data));
    api.get('/products').then(res => setProducts(res.data.content || res.data));
  }, []);

  const handleAddItem = () => {
    const prod = products.find(p => p.id === selectedProduct);
    if (!prod) return;

    setItems([...items, { productId: prod.id, name: prod.name , price: prod.price , quantity }]);
    setSelectedProduct('');
    setQuantity(1);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      await api.post('/commandes', {
        clientId: selectedClient,
        dateCommande: new Date(),
        ligneCommandes: items.map(item => ({ productId: item.productId, quantity: item.quantity })),
      });
      navigate('/orders');
    } catch (err) {
      console.error('Erreur lors de la création de la commande:', err);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" mb={3} fontWeight="bold">Créer une Commande</Typography>

        <Grid container spacing={3} mb={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              select fullWidth label="Sélectionner un Client"
              value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}
            >
              {clients.map(c => (
                <MenuItem key={c.id} value={c.id}>{c.nom} {c.prenom}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Typography variant="h6" mb={2}>Ajouter des Produits</Typography>
        <Grid container spacing={2} sx={{ alignItems: "center" }} mb={3}>
          <Grid size={{ xs: 6 }}>
            <TextField
              select fullWidth label="Produit"
              value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}
            >
              {products.map(p => (
                <MenuItem key={p.id} value={p.id}>{p.name || p.nom} ({p.price || p.prix} DH)</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 3 }}>
            <TextField
              type="number" fullWidth label="Quantité"
              value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}
              slotProps={{ htmlInput: { min: 1 } }}
            />
          </Grid>
          <Grid size={{ xs: 3 }}>
            <Button fullWidth variant="outlined" onClick={handleAddItem} disabled={!selectedProduct}>
              Ajouter
            </Button>
          </Grid>
        </Grid>

        {items.length > 0 && (
          <Table size="small" sx={{ mb: 3 }}>
            <TableHead>
              <TableRow>
                <TableCell>Produit</TableCell>
                <TableCell>Prix Unitaire</TableCell>
                <TableCell>Quantité</TableCell>
                <TableCell>Total</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price} DH</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price * item.quantity} DH</TableCell>
                  <TableCell align="center">
                    <IconButton onClick={() => handleRemoveItem(index)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/orders')}>Annuler</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!selectedClient || items.length === 0}>
            Valider la commande
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};