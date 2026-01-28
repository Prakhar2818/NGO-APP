import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import ForgotPassword from "../modules/auth/pages/ForgotPassword"
import ResetPassword from "../modules/auth/pages/ResetPassword"
import ProtectedRoutes from "./ProtectedRoutes"
import CompleteRegistration from "../modules/auth/pages/CompletRegistartion"
import ProfileGuard from "./ProfileGuard"
import NGODashboard from "../modules/auth/pages/dashboard/NGODashboard"
import RestaurantDashboard from "../modules/auth/pages/dashboard/RestaurantDashboard"
import AdminDashboard from "../modules/auth/pages/dashboard/AdminDashboard"


const AppRouter:React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Complete Registration */}
        <Route path="/complete-registration" element={
          <ProtectedRoutes>
            <CompleteRegistration />
          </ProtectedRoutes>
        } />

        {/* Private Routes */}
        <Route path="/ngo" element={
          <ProtectedRoutes>
            <ProfileGuard>
              <NGODashboard />
            </ProfileGuard>
          </ProtectedRoutes>
        } />

        <Route path="/restaurant" element={
          <ProtectedRoutes>
            <ProfileGuard>
              <RestaurantDashboard />
            </ProfileGuard>
          </ProtectedRoutes>
        } />

        <Route path="/admin" element={
          <ProtectedRoutes>
            <AdminDashboard />
          </ProtectedRoutes>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter