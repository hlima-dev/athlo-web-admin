import { BrowserRouter, Route, Routes } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { Donations } from "./pages/Donations";
import { Athletes } from "./pages/Athletes";
import { Events } from "./pages/Events";
import { Calendar } from "./pages/Calendar";
import { Reports } from "./pages/Reports";
import { Volunteers } from "./pages/Volunteers";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";

import { AppLayout } from "./layouts/AppLayout";
import { PrivateRoute } from "./routes/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />

        {/* Privadas */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/doacoes" element={<Donations />} />
          <Route path="/atletas" element={<Athletes />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/voluntarios" element={<Volunteers />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/configuracoes" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}