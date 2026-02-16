import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";

import api from "../../../services/api.js";
import {
  setRole,
  setProfileCompleted,
  setIsBlocked,
  getProfileCompleted,
  getRole,
  getIsBlocked,
} from "../../../utils/token.js";
import { loginSchema } from "../../../validations/auth.validation.js";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  role: "ADMIN" | "NGO" | "RESTAURANT";
  profileCompleted: boolean;
  isBlocked: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await loginSchema.validate(form, {
        abortEarly: false,
      });

      const res = await api.post<LoginResponse>("/auth/login", form);

      setRole(res.data.role);
      setProfileCompleted(res.data.profileCompleted);
      setIsBlocked(res.data.isBlocked);

      toast.success("Login Successful");

      const profileCompleted = getProfileCompleted();
      const role = getRole();

      if (!profileCompleted) {
        navigate("/complete-registration", { replace: true });
        return;
      }

      const isBlocked = getIsBlocked();
      if (isBlocked) {
        toast.error("Your account has been blocked. Please contact support.");
        return;
      }

      if (role === "ADMIN") navigate("/admin", { replace: true });
      else if (role === "NGO") navigate("/ngo", { replace: true });
      else navigate("/restaurant", { replace: true });
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
        return;
      }

      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex font-mono">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex-col justify-center items-center px-12 py-16 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-2xl"></div>
        
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Welcome to<br />
            <span className="text-purple-200">FoodBridge</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-md leading-relaxed">
            Connecting restaurants with NGOs to reduce food waste and feed those in need.
          </p>
          
          <div className="space-y-4 text-left max-w-md">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Quick & Easy</h3>
                <p className="text-purple-200 text-sm">Donate surplus food in minutes</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Make an Impact</h3>
                <p className="text-purple-200 text-sm">Help feed communities in need</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Secure Platform</h3>
                <p className="text-purple-200 text-sm">Verified NGOs and restaurants</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 flex items-center justify-center relative min-h-screen">
        <div className="lg:hidden absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">FoodBridge</h1>
          <p className="text-purple-200 text-sm mt-1">Connecting restaurants with NGOs</p>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 transition hover:shadow-purple-200 lg:absolute lg:-left-28 mt-24 lg:mt-0 mx-4 lg:mx-0"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-700 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-lg sm:text-xl text-gray-500 mb-6 sm:mb-8">
            Login to continue
          </p>

          <div className="mb-5">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Email
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                name="email"
                placeholder="Enter your email"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Password
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>

          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]">
            Login
          </button>

          <div className="flex justify-between mt-5 text-m">
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Forgot Password?
            </span>
            <span
              onClick={() => navigate("/register")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Create Account
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
