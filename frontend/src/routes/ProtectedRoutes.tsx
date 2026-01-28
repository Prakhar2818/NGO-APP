import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { getToken } from "../utils/token.js";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const token = getToken();
  return token ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoutes;
