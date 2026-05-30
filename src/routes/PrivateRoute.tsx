import { Navigate, useLocation } from "react-router-dom";

type PrivateRouteProps = {
  children: React.ReactNode;
};

export function PrivateRoute({ children }: PrivateRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}