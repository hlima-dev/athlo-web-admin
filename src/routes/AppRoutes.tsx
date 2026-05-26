import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { LandingPage } from "../pages/LandingPage";
import { Dashboard } from "../pages/Dashboard";
import { Home } from "../pages/Home";
import { Athletes } from "../pages/Athletes";
import { Events } from "../pages/Events";
import { Donations } from "../pages/Donations";
import { Notifications } from "../pages/Notifications";
import { Settings } from "../pages/Settings";
import { Login } from "../pages/Login";
import { CalendarPage } from "../pages/Calendar";
import { Volunteers } from "../pages/Volunteers";
import { Reports } from "../pages/Reports";
import { Profile } from "../pages/Profile";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<Login />} />

        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Home />} />
          <Route path="/atletas" element={<Athletes />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/calendario" element={<CalendarPage />} />
          <Route path="/doacoes" element={<Donations />} />
          <Route path="/voluntarios" element={<Volunteers />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/configuracoes" element={<Settings />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}