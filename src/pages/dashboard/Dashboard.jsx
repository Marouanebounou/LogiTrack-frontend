import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import {
  Box, CircularProgress, Typography, Grid, Chip, Paper,
  Table, TableHead, TableBody, TableRow, TableCell
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { DashboardCard } from "../../components/Dashboard/DashboardCard"

const STATUS_COLOR = { LIVREE: "success", EXPEDIEE: "info", EN_ATTENTE: "warning" };

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user?.role == "AGENT") {
    window.location.href = "/clients"
  }

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, lowRes, ordersRes] = await Promise.all([
          api.get("/stats"),
          api.get("/products/low-stock", { params: { threshold: 10, size: 5 } }),
          api.get("/commandes", { params: { size: 5, sort: "dateCommande,desc" } }),
        ]);
        setStats(statsRes.data);
        setLowStock(lowRes.data.content || lowRes.data);
        setRecentOrders(ordersRes.data.content || ordersRes.data);
      } catch (error) {
        console.error("Erreur lors du chargement du tableau de bord:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Tableau de bord
      </Typography>
      <Typography color="textSecondary" sx={{ mb: 3 }}>
        Bienvenue, {user?.nom} ({user?.role})
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Clients" value={stats?.totalClients || 0} icon={<PeopleIcon />} color="info.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Produits" value={stats?.totalProducts || 0} icon={<InventoryIcon />} color="primary.main" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard title="Total Commandes" value={stats?.totalCommandes || 0} icon={<ShoppingCartIcon />} color="secondary.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DashboardCard title="En Attente" value={stats?.pendingCommandes || 0} icon={<ShoppingCartIcon />} color="warning.main" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard title="Expédiées" value={stats?.expedieeCommandes || 0} icon={<LocalShippingIcon />} color="info.main" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard title="Livrées" value={stats?.livreeCommandes || 0} icon={<CheckCircleIcon />} color="success.main" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <WarningAmberIcon color="warning" />
              <Typography variant="h6" fontWeight="bold">Produits — Stock Faible</Typography>
            </Box>
            {lowStock.length === 0 ? (
              <Typography color="textSecondary">Aucun produit en stock faible.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Produit</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell align="right">Stock</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStock.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{p.name}</TableCell>
                      <TableCell>{p.category}</TableCell>
                      <TableCell align="right">
                        <Chip label={p.quantity} color={p.quantity <= 5 ? "error" : "warning"} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <ShoppingCartIcon color="primary" />
              <Typography variant="h6" fontWeight="bold">Commandes Récentes</Typography>
            </Box>
            {recentOrders.length === 0 ? (
              <Typography color="textSecondary">Aucune commande.</Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Statut</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell>#{o.id}</TableCell>
                      <TableCell>#{o.clientId}</TableCell>
                      <TableCell>
                        {o.dateCommande ? new Date(o.dateCommande).toLocaleDateString("fr-FR") : "—"}
                      </TableCell>
                      <TableCell align="right">
                        <Chip label={o.statutCommande} color={STATUS_COLOR[o.statutCommande] || "default"} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
