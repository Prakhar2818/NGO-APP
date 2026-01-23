import { Navigate } from "react-router-dom";
import { getToken } from "../utils/token.js"

const ProtectedRoutes = ({ children }) => {
  const token = getToken()
  return token ? children : <Navigate to="/" />
}

export default ProtectedRoutes