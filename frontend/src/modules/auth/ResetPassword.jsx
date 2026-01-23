import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import { toast } from "react-toastify";

const ResetPassword = () => {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");

  const navigate = useNavigate()

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/reset-password", form);
      toast.success(res.data.message);

      setTimeout(() => {
        navigate("/")
      }, 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow w-96">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <input name="email" placeholder="Email" className="border p-2 w-full mb-2" onChange={handleChange} required />
        <input name="otp" placeholder="OTP" className="border p-2 w-full mb-2" onChange={handleChange} required />
        <input type="password" name="newPassword" placeholder="New Password" className="border p-2 w-full mb-3" onChange={handleChange} required />

        <button className="bg-green-600 text-white w-full p-2">
          Reset Password
        </button>

        {message && <p className="text-center mt-3">{message}</p>}
      </form>
    </div>
  );
};

export default ResetPassword;
