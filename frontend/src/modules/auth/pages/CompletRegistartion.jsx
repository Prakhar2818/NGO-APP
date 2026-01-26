import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api.js"
import { toast } from "react-toastify";
import { getRole, setProfileCompleted } from "../../../utils/token";

const CompleteRegistration = () => {
  const navigate = useNavigate()
  const role = getRole()
  const [loading, setLoading] = useState()

  const [form, setForm] = useState({
    organizationName: "",
    restaurantName: "",
    address: "",
    phone: "",
  });

  const [files, setFiles] = useState({})

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const formData = new FormData()
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key])
      })

      Object.keys(files).forEach((key) => {
        if (files[key]) formData.append(key, files[key])
      })

      await api.post("/profile/complete-registration", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })

      setProfileCompleted(true)


      toast.success("Registration completed successfully")

      setTimeout(() => {
        if (role === "NGO") navigate("/ngo")
        else if (role === "RESTAURANT") navigate("/restaurant")
      }, 1500)
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Complete Registration
        </h2>

        {role === "NGO" && (
          <input
            name="organizationName"
            placeholder="NGO Name"
            className="border p-2 w-full mb-3"
            onChange={handleChange}

          />
        )}

        {role === "RESTAURANT" && (
          <input
            name="restaurantName"
            placeholder="Restaurant Name"
            className="border p-2 w-full mb-3"
            onChange={handleChange}
          />
        )}

        <input
          name="address"
          placeholder="Address"
          className="border p-2 w-full mb-3"
          onChange={handleChange}

        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="border p-2 w-full mb-4"
          onChange={handleChange}

        />

        {/* NGO DOCUMENTS */}
        {role === "NGO" && (
          <>
            <h3 className="font-semibold mb-2">NGO Documents</h3>

            <input type="file" name="registrationCertificate" onChange={handleFileChange} />
            <input type="file" name="panCard" onChange={handleFileChange} />
            <input type="file" name="addressProof" onChange={handleFileChange} />
            <input type="file" name="bankProof" onChange={handleFileChange} />
            <input type="file" name="authorizedPersonId" onChange={handleFileChange} />
          </>
        )}

        {/* RESTAURANT DOCUMENTS */}
        {role === "RESTAURANT" && (
          <>
            <h3 className="font-semibold mb-2">Restaurant Documents</h3>

            <input type="file" name="fssaiLicense" onChange={handleFileChange} />
            <input type="file" name="gstCertificate" onChange={handleFileChange} />
            <input type="file" name="businessRegistration" onChange={handleFileChange} />
            <input type="file" name="panCard" onChange={handleFileChange} />
            <input type="file" name="addressProof" onChange={handleFileChange} />
            <input type="file" name="ownerId" onChange={handleFileChange} />
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white w-full p-2 mt-4 rounded"
        >
          {loading ? "Submitting..." : "Submit Registration"}
        </button>
      </form>
    </div>
  );
}

export default CompleteRegistration