import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js";
import { toast } from "react-toastify";
import { getRole, setProfileCompleted } from "../../../utils/token.js";

type Role = "NGO" | "RESTAURANT";

interface RegistrationForm {
  organizationName?: string;
  restaurantName?: string;
  address: string;
  phone: string;
}

type FileMap = Record<string, File>;

const CompleteRegistration: React.FC = () => {
  const navigate = useNavigate();
  const role = getRole();
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setForm] = useState<RegistrationForm>({
    organizationName: "",
    restaurantName: "",
    address: "",
    phone: "",
  });

  const [files, setFiles] = useState<FileMap>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        const value = form[key as keyof RegistrationForm];
        if (value) formData.append(key, value);
      });

      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });

      await api.post("/profile/complete-registration", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProfileCompleted(true);

      toast.success("Registration completed successfully");

      setTimeout(() => {
        if (role === "NGO") navigate("/ngo");
        else if (role === "RESTAURANT") navigate("/restaurant");
      }, 1500);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 transition hover:shadow-purple-200"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
          Complete Registration
        </h2>
        <p className="text-center text-xl text-gray-500 mb-6">
          Register {role}
        </p>
        {role === "NGO" && (
          <div className="mb-3">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Organization Name
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                name="organizationName"
                placeholder="NGO Name"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {role === "RESTAURANT" && (
          <div className="mb-3">
            <label className="block text-m font-semibold text-purple-600 mb-2">
              Restuarant Name
            </label>
            <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
              <input
                name="restaurantName"
                placeholder="Restaurant Name"
                className="w-full outline-none bg-transparent"
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        <div className="mb-3">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Address
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              name="address"
              placeholder="Address"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-m font-semibold text-purple-600 mb-2">
            Phone
          </label>
          <div className="flex items-center border border-purple-300 rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-purple-500">
            <input
              name="phone"
              placeholder="Phone Number"
              className="w-full outline-none bg-transparent"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* NGO DOCUMENTS */}
        {role === "NGO" && (
          <>
            <h3 className="text-m font-semibold text-purple-700 mb-3">
              NGO Documents
            </h3>

            <div className="max-h-50 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
              {[
                {
                  label: "Registration Certificate",
                  name: "registrationCertificate",
                },
                { label: "PAN Card", name: "panCard" },
                { label: "Address Proof", name: "addressProof" },
                { label: "Bank Proof", name: "bankProof" },
                { label: "Authorized Person ID", name: "authorizedPersonId" },
              ].map((doc) => (
                <div key={doc.name} className="mb-3">
                  <label className="block text-sm font-semibold text-purple-600 mb-1">
                    {doc.label}
                  </label>

                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-3 hover:border-purple-500">
                    <input
                      type="file"
                      name={doc.name}
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-purple-100 file:text-purple-700
                         hover:file:bg-purple-200 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* RESTAURANT DOCUMENTS */}
        {role === "RESTAURANT" && (
          <>
            <h3 className="font-semibold text-purple-700 mb-3">
              Restaurant Documents
            </h3>

            <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-purple-100">
              {[
                { label: "FSSAI License", name: "fssaiLicense" },
                { label: "GST Certificate", name: "gstCertificate" },
                {
                  label: "Business Registration",
                  name: "businessRegistration",
                },
                { label: "PAN Card", name: "panCard" },
                { label: "Address Proof", name: "addressProof" },
                { label: "Owner ID Proof", name: "ownerId" },
              ].map((doc) => (
                <div key={doc.name} className="mb-3">
                  <label className="block text-sm font-semibold text-purple-600 mb-1">
                    {doc.label}
                  </label>

                  <div className="border-2 border-dashed border-purple-300 rounded-xl p-3 hover:border-purple-500 transition">
                    <input
                      type="file"
                      name={doc.name}
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                         file:rounded-lg file:border-0
                         file:bg-purple-100 file:text-purple-700
                         hover:file:bg-purple-200 cursor-pointer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white  py-3 rounded-xl font-semibold transition transform hover:scale-[1.02]"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
};

export default CompleteRegistration;
