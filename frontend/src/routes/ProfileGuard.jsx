import { Navigate } from "react-router-dom";
import { getProfileCompleted } from "../utils/token";

const ProfileGuard = ({ children }) => {
  const profileCompleted = getProfileCompleted()

  if (!profileCompleted) {
    <Navigate to="/complete-registration" />
  }

  return children
}

export default ProfileGuard