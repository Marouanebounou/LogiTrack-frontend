import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { ProtectedRoute } from "./components/guards/ProtectedRoute";
import { MainLayout } from "./components/common/MainLayout";
import { DashboardPage } from "./pages/dashboard/Dashboard";
import { ClientList } from "./pages/Clients/ClientsList";
import { ClientForm } from "./pages/Clients/ClientsForm";
import { ProductList } from "./pages/Products/ProductList";
import { OrderList } from "./pages/Orders/OrderList";
import { OrderForm } from "./pages/Orders/OrderForm";
import { ProductForm } from "./pages/Products/ProductForm";
import { UserList } from "./pages/Users/UserList";
import { UserForm } from "./pages/Users/UserForm";import { ClientDetails } from './pages/Clients/ClientDetails';
import { ProductDetails } from './pages/Products/ProductDetails';
import { OrderDetails } from './pages/Orders/OrderDetails';import { AccessDenied } from "./pages/errors/AcessDenied";
import { NotFound } from "./pages/errors/NotFound";

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}/>
          <Route path="/register" element={<RegisterPage />}/>

          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />}/>
              <Route path="/clients" element={<ClientList />}/>
              <Route path="/clients/new" element={<ClientForm />}/>
              <Route path="/clients/edit/:id" element={<ClientForm />}/>
              <Route path="/clients/:id" element={<ClientDetails />}/>
              <Route path="/products" element={<ProductList />}/>
              <Route path="/products/new" element={<ProductForm />}/>
              <Route path="/products/edit/:id" element={<ProductForm />}/>
              <Route path="/products/:id" element={<ProductDetails />}/>
              <Route path="/orders" element={<OrderList />}/>
              <Route path="/orders/new" element={<OrderForm />}/>
              <Route path="/orders/:id" element={<OrderDetails />}/>
              <Route path="/users" element={<UserList />}/>
              <Route path="/users/new" element={<UserForm />}/>
            </Route>
          </Route>

          <Route path="/access-denied" element={<AccessDenied />}/>
          <Route path="/not-found" element={<NotFound />}/>

          <Route path="/" element={<Navigate to={"/login"} replace />}/>
          <Route path="*" element={<Navigate to={"/login"} replace />}/>
        </Routes>
      </Router>
  );
}

export default App
