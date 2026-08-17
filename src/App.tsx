import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ForgotPassword } from "./pages/ForgotPassword";
import { ResetPassword } from "./pages/ResetPassword";

import { Dashboard } from "./pages/Dashboard";
import { Financeiro } from "./pages/Financeiro";
import { Contacts } from "./pages/Contacts";
import { Products } from "./pages/Products";
import { Orders } from "./pages/Orders";
import { Events } from "./pages/Events";
import { Calendar } from "./pages/Calendar";
import { Reports } from "./pages/Reports";
import { Team } from "./pages/Team";
import { Notifications } from "./pages/Notifications";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { Admin } from "./pages/Admin";
import { VerifyEmail } from "./pages/VerifyEmail";
import { SelectOrganization } from "./pages/SelectOrganization";

import { AppLayout } from "./layouts/AppLayout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { PlatformAdminRoute } from "./routes/PlatformAdminRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/registrar" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/redefinir-senha" element={<ResetPassword />} />

        <Route path="/verificar-email" element={<VerifyEmail />} />
        <Route path="/selecionar-empresa" element={<SelectOrganization />} />

        {/* Privadas */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Navigate to="/dashboard" replace />} />
          <Route path="/financeiro" element={<Financeiro />} />
          <Route path="/contatos" element={<Contacts />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/eventos" element={<Events />} />
          <Route path="/calendario" element={<Calendar />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/equipe" element={<Team />} />
          <Route path="/notificacoes" element={<Notifications />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route
            path="/admin"
            element={
              <PlatformAdminRoute>
                <Admin />
              </PlatformAdminRoute>
            }
          />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
