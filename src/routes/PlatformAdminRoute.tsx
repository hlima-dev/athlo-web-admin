import { Navigate } from "react-router-dom";
import { getStoredUser } from "../services/auth";

type Props = {
  children: React.ReactNode;
};

// Protege rotas restritas à equipe ATHLO (isPlatformAdmin), diferente do
// orgRole OWNER/ADMIN de cada empresa cliente.
export function PlatformAdminRoute({ children }: Props) {
  const user = getStoredUser();

  if (!user?.isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
