import { removeToken } from "../../../../utils/token.js"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

const RestaurantDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    removeToken()
    toast.success("Logged out successfully")
    setTimeout(() => {
      navigate("/")
    }, 500)
  }
  return (
    <div className="flex justify-between align-center">
      <h1 className="font-bold text-4xl">Restaurant Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 text-white text-lg font-bold px-3 py-2 rounded-lg cursor-pointer transition transform hover:scale-[1.02]">Logout</button>
    </div>
  )
}

export default RestaurantDashboard