import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Navigate } from "react-router-dom"

import Login from "../modules/auth/Login"
import Register from "../modules/auth/Register"
import ForgotPassword from "../modules/auth/ForgotPassword"
import ResetPassword from "../modules/auth/ResetPassword"
import ProtectedRoutes from "./ProtectedRoutes"
import CompleteRegistration from "../modules/auth/pages/CompletRegistartion"
import ProfileGuard from "./ProfileGuard"


const AppRouter = () => {
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
              <h1>NGO Dashboard</h1>
            </ProfileGuard>
          </ProtectedRoutes>
        } />

        <Route path="/restaurant" element={
          <ProtectedRoutes>
            <ProfileGuard>
              <h1>Restaurant Dashboard</h1>
            </ProfileGuard>
          </ProtectedRoutes>
        } />

        <Route path="/admin" element={
          <ProtectedRoutes>
            <h1>Admin Darshboard</h1>
          </ProtectedRoutes>
        } />

      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter