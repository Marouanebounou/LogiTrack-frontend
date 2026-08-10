import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axiosInstance";
import { Box, CircularProgress, Typography, Grid, Card, CardContent, Alert, Table, TableHead, TableBody, TableRow, TableCell } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DashboardCard } from "../../components/dashboard/DashboardCard";

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await api.get("/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
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
          <DashboardCard
            title="Total Clients"
            value={stats?.totalClients || 0}
            icon={<PeopleIcon />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Produits"
            value={stats?.totalProducts || 0}
            icon={<InventoryIcon />}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Commandes"
            value={stats?.totalCommandes || 0}
            icon={<ShoppingCartIcon />}
            color="secondary.main"
          />
        </Grid>

      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="En Attente"
            value={stats?.pendingCommandes || 0}
            icon={<ShoppingCartIcon />}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="Expédiées"
            value={stats?.livreeCommandes || 0}
            icon={<LocalShippingIcon />}
            color="info.main"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DashboardCard
            title="Livrées"
            value={stats?.expedieeCommandes || 0}
            icon={<CheckCircleIcon />}
            color="success.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid
          item
          xs={12}
        >
        </Grid>
      </Grid>
    </Box>
  );
};
