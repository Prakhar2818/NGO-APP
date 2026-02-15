import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import api from "../services/api";
import { setIsBlocked, setProfileCompleted, setRole } from "../utils/token";

interface ProtectedRoutesProps {
  children: ReactNode;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        const res = await api.get("/auth/me");
        const role = res.data?.role;
        const profileCompleted = Boolean(res.data?.profileCompleted);
        const isBlocked = Boolean(res.data?.isBlocked);

        if (role) setRole(role);
        setProfileCompleted(profileCompleted);
        setIsBlocked(isBlocked);

        if (isMounted) setIsAuthorized(true);
      } catch {
        if (isMounted) setIsAuthorized(false);
      } finally {
        if (isMounted) setIsChecking(false);
      }
    };

    validateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isChecking) {
    return null;
  }

  return isAuthorized ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
