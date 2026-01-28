import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";

import { toast } from "react-toastify";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      await api.post("/auth/forgot-password", { email });
      toast.success("OTP sent to the the mail");

      setTimeout(() => {
        navigate("/reset-password", {
          state: { email },
        });
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition hover:shadow-purple-200"
      >
        <h2 className="text-4xl font-bold text-center text-purple-700 mb-5">
          Forgot Password
        </h2>

        <p className="text-center text-xl text-gray-500 mb-6">
          Enter email to generate OTP
        </p>

        <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500 mb-5">
          <input
            type="email"
            placeholder="Registered Email"
            className="w-full outline-none bg-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]">
          Send OTP
        </button>

        {message && <p className="mt-3 text-center">{message}</p>}
      </form>
    </div>
  );
};

export default ForgotPassword;
