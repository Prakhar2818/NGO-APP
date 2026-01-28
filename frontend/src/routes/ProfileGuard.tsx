import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { getProfileCompleted } from "../utils/token";

interface ProfileGuardProps {
  children: ReactNode;
}

const ProfileGuard: React.FC<ProfileGuardProps> = ({ children }) => {
  const profileCompleted = getProfileCompleted();

  if (!profileCompleted) {
    <Navigate to="/complete-registration" />;
  }

  return <>{children}</>;
};

export default ProfileGuard;
