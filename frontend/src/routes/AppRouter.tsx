import { BrowserRouter, Route, Routes } from "react-router-dom"

import Login from "../modules/auth/pages/Login"
import Register from "../modules/auth/pages/Register"
import ForgotPassword from "../modules/auth/pages/ForgotPassword"
import ResetPassword from "../modules/auth/pages/ResetPassword"
import LandingPage from "../modules/public/pages/LandingPage"
import ProtectedRoutes from "./ProtectedRoutes"
import CompleteRegistration from "../modules/auth/pages/CompletRegistartion"
import ProfileGuard from "./ProfileGuard"
import BlockedGuard from "./BlockedGuard"

import NGODashboard from "../modules/auth/pages/dashboard/ngo/NGODashboard"
import RestaurantDashboard from "../modules/auth/pages/dashboard/restaurant/RestaurantDashboard"
import AdminDashboard from "../modules/auth/pages/dashboard/admin/AdminDashboard"

const AppRouter:React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
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
              <BlockedGuard>
                <NGODashboard />
              </BlockedGuard>
            </ProfileGuard>
          </ProtectedRoutes>
        } />

        <Route path="/restaurant" element={
          <ProtectedRoutes>
            <ProfileGuard>
              <BlockedGuard>
                <RestaurantDashboard />
              </BlockedGuard>
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
