import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import api from "../../../services/api.js";
import { registerSchema } from "../../../validations/auth.validation.js";

type Role = "NGO" | "RESTAURANT";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const Register: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    role: "NGO",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await registerSchema.validate(form, {
        abortEarly: false,
      });

      const res = await api.post("/auth/register", form);

      toast.success("Registration successful. Please login.");
      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err: any) {
      if (err instanceof yup.ValidationError) {
        toast.error(err.errors[0]);
        return;
      }
      return;
    } finally {
      setLoading(false);
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
            Join<br />
            <span className="text-purple-200">FoodBridge</span>
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-md leading-relaxed">
            Become a part of our mission to reduce food waste and help communities thrive.
          </p>
          
          <div className="space-y-4 text-left max-w-md">
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">For Restaurants</h3>
                <p className="text-purple-200 text-sm">Donate surplus food easily</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">For NGOs</h3>
                <p className="text-purple-200 text-sm">Find and collect food donations</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold">Make a Difference</h3>
                <p className="text-purple-200 text-sm">Every meal counts in fighting hunger</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 flex items-center justify-center relative min-h-screen">
        <div className="lg:hidden absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white">Join FoodBridge</h1>
          <p className="text-purple-200 text-sm mt-1">Reduce food waste, help communities</p>
        </div>
        
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-8 transition hover:shadow-purple-200 lg:absolute lg:-left-28 mt-28 lg:mt-0 mx-4 lg:mx-0"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-purple-700 mb-2">
            Create Account
          </h2>
          <p className="text-center text-lg sm:text-xl text-gray-500 mb-4 sm:mb-6">Register</p>

          <div className="mb-3">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Full Name
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Email
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                name="email"
                placeholder="Email"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Password
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Select Role
            </label>

            <div className="relative">
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full appearance-none bg-white border border-purple-300 px-4 py-3 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
              >
                <option value="NGO">NGO</option>
                <option value="RESTAURANT">Restaurant</option>
              </select>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-500 pointer-events-none">
                ▼
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          {message && (
            <p className="text-center mt-3 text-sm text-red-600">{message}</p>
          )}

          <p className="text-center text-m mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-purple-600 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
