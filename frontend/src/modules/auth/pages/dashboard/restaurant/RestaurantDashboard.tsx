import { useEffect, useState } from "react";
import { Utensils, Clock, CheckCircle, TrendingUp, Plus } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import CreateDonation from "./CreateDonation";
import ActiveDonations from "./ActiveDonations";
import DonationHistory from "./DonationHistory";
import MetricCard from "../../../../components/MetricCard";
import api from "../../../../../services/api";
import { logout } from "../../../../../utils/token";
import { useNavigate } from "react-router-dom";

const RestaurantDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "create" | "active" | "history"
  >("overview");

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    meals: 0,
  });

  const [donations, setDonations] = useState<any[]>([]);

  const navigate = useNavigate();

  const fetchDashboardData = () => {
    api.get("/donation/restaurant/dashboard").then((res) => {
      const d = res.data.donations;
      setDonations(d);
      setStats({
        total: d.length,
        active: d.filter((x: any) => x.status !== "PICKED_UP").length,
        completed: d.filter((x: any) => x.status === "PICKED_UP").length,
        meals: d.reduce((s: number, x: any) => s + x.quantity, 0),
      });
    });
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
      title="Restaurant Dashboard"
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "create", label: "Create" },
        { key: "active", label: "Active" },
        { key: "history", label: "History" },
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
            {activeTab === "create" && "Create New Donation"}
            {activeTab === "active" && "Active Donations"}
            {activeTab === "history" && "Donation History"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {activeTab === "overview" && "Track your donation impact and statistics"}
            {activeTab === "create" && "Fill in the details to create a new food donation"}
            {activeTab === "active" && "Manage your ongoing donations"}
            {activeTab === "history" && "View your completed donations"}
          </p>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <MetricCard
                label="Total Donations"
                value={stats.total}
                icon={<Utensils className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Meals Saved"
                value={stats.meals}
                icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Active"
                value={stats.active}
                icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Completed"
                value={stats.completed}
                icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab("create")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Create Donation
                </button>
                <button
                  onClick={() => setActiveTab("active")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  View Active
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === "create" && <CreateDonation />}
        {activeTab === "active" && (
          <ActiveDonations 
            donations={donations.filter((d) => d.status !== "PICKED_UP")} 
            onDonationUpdated={fetchDashboardData}
          />
        )}
        {activeTab === "history" && (
          <DonationHistory donations={donations.filter((d) => d.status === "PICKED_UP")} />
        )}
      </div>
    </Navbar>
  );
};

export default RestaurantDashboard;
