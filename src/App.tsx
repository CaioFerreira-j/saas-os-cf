import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AuthLayout from "./layouts/AuthLayout";

import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Login from "./pages/auth/Login";
import Dashboard from "./pages/admin/Dashboard";
import OSList from "./pages/os/OSList";
import NewOS from "./pages/os/NewOS";
import Vehicles from "./pages/vehicles/Vehicles";
import Customers from "./pages/customers/Customers";
import Services from "./pages/services/Services";
import Finance from "./pages/finance/Finance";
import Settings from "./pages/settings/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>

        {/* Private Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="os" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          <Route path="os">
            <Route index element={<OSList />} />
            <Route path="new" element={<NewOS />} />
          </Route>
          
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="customers" element={<Customers />} />
          <Route path="services" element={<Services />} />
          <Route path="finance" element={<Finance />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        </Route>

        {/* Redirect root to app or login */}
        <Route path="/" element={<Navigate to="/app/os" replace />} />
        <Route path="*" element={<Navigate to="/app/os" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
