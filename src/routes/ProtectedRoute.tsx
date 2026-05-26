import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const token = localStorage.getItem("@athlo:token");

  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}