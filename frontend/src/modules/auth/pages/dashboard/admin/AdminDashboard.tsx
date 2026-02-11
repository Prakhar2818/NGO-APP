import { useEffect, useState } from "react";
import {
  Users,
  Gift,
  TrendingUp,
  Shield,
  UserPlus,
  Settings,
} from "lucide-react";
import Navbar from "../../../../components/Navbar";
import UsersManagement from "./Users";
import AllDonations from "./AllDonations";
import Analytics from "./Analytics";
import MetricCard from "../../../../components/MetricCard";
import api from "../../../../../services/api";
import { logout } from "../../../../../utils/token";
import { useNavigate } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "users" | "donations" | "analytics"
  >("overview");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDonations: 0,
    restaurants: 0,
    ngos: 0,
  });

  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      const [usersRes, donationsRes] = await Promise.all([
        api.get("/admin/users"),
        api.get("/admin/donations"),
      ]);

      const users = usersRes.data.users || [];
      const donations = donationsRes.data.donations || [];

      setStats({
        totalUsers: users.length,
        totalDonations: donations.length,
        restaurants: users.filter((u: any) => u.role === "RESTAURANT").length,
        ngos: users.filter((u: any) => u.role === "NGO").length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if API call fails, clear local data
    } finally {
      logout();
      navigate("/");
    }
  };

  return (
    <Navbar
      title="Admin Dashboard"
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "users", label: "Users" },
        { key: "donations", label: "Donations" },
        { key: "analytics", label: "Analytics" },
      ]}
      activeTab={activeTab}
      onTabChange={(k) => setActiveTab(k as any)}
      rightSlot={
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          Logout
        </button>
      }
    >
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "users" && "User Management"}
            {activeTab === "donations" && "All Donations"}
            {activeTab === "analytics" && "Analytics & Reports"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {activeTab === "overview" &&
              "Monitor platform activity and statistics"}
            {activeTab === "users" && "Manage restaurants and NGOs"}
            {activeTab === "donations" && "View and manage all donations"}
            {activeTab === "analytics" && "Track donation trends and insights"}
          </p>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <MetricCard
                label="Total Users"
                value={stats.totalUsers}
                icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Total Donations"
                value={stats.totalDonations}
                icon={<Gift className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Restaurants"
                value={stats.restaurants}
                icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="NGOs"
                value={stats.ngos}
                icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab("users")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Manage Users
                </button>
                <button
                  onClick={() => setActiveTab("donations")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <Gift size={16} className="sm:w-[18px] sm:h-[18px]" />
                  View Donations
                </button>
                <button
                  onClick={() => setActiveTab("analytics")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <TrendingUp size={16} className="sm:w-[18px] sm:h-[18px]" />
                  View Analytics
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "users" && (
          <UsersManagement onUserUpdated={fetchDashboardData} />
        )}
        {activeTab === "donations" && <AllDonations />}
        {activeTab === "analytics" && <Analytics />}
      </div>
    </Navbar>
  );
};

export default AdminDashboard;
