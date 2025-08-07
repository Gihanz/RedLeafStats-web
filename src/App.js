import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EE_Dashboard from "./pages/EE_Dashboard";
import OINP_Dashboard from "./pages/OINP_Dashboard";
import BC_PNP_Dashboard from "./pages/BC_PNP_Dashboard";
import SINP_Dashboard from "./pages/SINP_Dashboard";
import AAIP_Dashboard from "./pages/AAIP_Dashboard";
import MPNP_Dashboard from "./pages/MPNP_Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          success: {
            iconTheme: {
              primary: "#26374a", 
              secondary: "white", 
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard_ee" element={<ProtectedRoute><EE_Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard_oinp" element={<ProtectedRoute><OINP_Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard_bc_pnp" element={<ProtectedRoute><BC_PNP_Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard_sinp" element={<ProtectedRoute><SINP_Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard_aaip" element={<ProtectedRoute><AAIP_Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard_mpnp" element={<ProtectedRoute><MPNP_Dashboard /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
