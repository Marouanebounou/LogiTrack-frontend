import Toolbar from "@mui/material/Toolbar";
import { useAuth } from "../../context/AuthContext";
import AppBar from "@mui/material/AppBar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";


export const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          LogiTrack
        </Typography>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body2">
              {user.nom} {user.prenom}
            </Typography>
            <Chip
              label={user.role}
              color={
                user.role === "ADMIN"
                  ? "error"
                  : user.role === "MANAGER"
                    ? "warning"
                    : "default"
              }
              size="small"
            />
            <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>
              Déconnexion
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
