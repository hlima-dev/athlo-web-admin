import { BrowserRouter, Route, Routes } from "react-router-dom";

import { AppLayout } from "../layouts/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";

import { LandingPage } from "../pages/LandingPage.tsx";
import { Dashboard } from "../pages/Dashboard.tsx";
import { Home } from "../pages/Home.tsx";
import { Athletes } from "../pages/Athletes.tsx";
import { Events } from "../pages/Events.tsx";
import { Donations } from "../pages/Donations.tsx";
import { Notifications } from "../pages/Notifications.tsx";
import { Settings } from "../pages/Settings.tsx";
import { Login } from "../pages/Login.tsx";
import { CalendarPage } from "../pages/Calendar.tsx";
import { Volunteers } from "../pages/Volunteers.tsx";
import { Reports } from "../pages/Reports.tsx";
import { Profile } from "../pages/Profile.tsx";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LANDING PAGE */}
        <Route path="/" element={<LandingPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PAINEL ADMINISTRATIVO */}
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

          <Route
            path="/calendario"
            element={<CalendarPage />}
          />

          <Route
            path="/doacoes"
            element={<Donations />}
          />

          <Route
            path="/voluntarios"
            element={<Volunteers />}
          />

          <Route
            path="/relatorios"
            element={<Reports />}
          />

          <Route
            path="/notificacoes"
            element={<Notifications />}
          />

          <Route
            path="/perfil"
            element={<Profile />}
          />

          <Route
            path="/configuracoes"
            element={<Settings />}
          />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}