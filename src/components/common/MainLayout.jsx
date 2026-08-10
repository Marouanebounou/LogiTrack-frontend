import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Outlet } from "react-router-dom";
import { SideBar } from "./SideBar";
import { NavBar } from "./NavBar";


export const MainLayout = () => {
    return (
    <Box sx={{ display: 'flex' }}>
      <NavBar />
      <SideBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}