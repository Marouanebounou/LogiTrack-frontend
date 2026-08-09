import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div className="p-8"><h1 className="text-2xl font-bold">Tableau de Bord LogiTrack</h1></div>}/>
          </Route>

          <Route path="/" element={<Navigate to={"/login"} replace />}/>
          <Route path="*" element={<Navigate to={"/login"} replace />}/>
        </Routes>
      </Router>
  );
}

export default App
