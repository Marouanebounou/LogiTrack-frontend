import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const drawerWidth = 240;

export const SideBar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Tableau de bord",
      path: "/dashboard",
      icon: <DashboardIcon />,
      roles: ["ADMIN", "MANAGER"],
    },
    {
      text: "Clients",
      path: "/clients",
      icon: <PeopleIcon />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      text: "Produits",
      path: "/products",
      icon: <InventoryIcon />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      text: "Commandes",
      path: "/orders",
      icon: <ShoppingCartIcon />,
      roles: ["ADMIN", "MANAGER", "AGENT"],
    },
    {
      text: "Utilisateurs",
      path: "/users",
      icon: <AdminPanelSettingsIcon />,
      roles: ["ADMIN"],
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List>
          {menuItems
            .filter((item) => user && item.roles.includes(user.role))
            .map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  selected={location.pathname === item.path}
                  onClick={() => navigate(item.path)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
        </List>
      </Box>
    </Drawer>
  );
};
