import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import ProtectedRoute from "@/ProtectedRoute";
export default function App() {
  return (
    <Routes>

      {/* RUTAS PUBLICAS */}
      <Route path="/auth/*" element={<Auth />} />

      {/* RUTAS PROTEGIDAS */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* SI NO ESTA LOGUEADO, CUALQUIER RUTA → /auth/sign-in */}
      <Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
    </Routes>
  );
}
