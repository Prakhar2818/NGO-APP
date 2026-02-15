import { useEffect, useMemo, useState } from "react";
import { Utensils, Clock, CheckCircle, TrendingUp, Plus } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import CreateDonation from "./CreateDonation";
import ActiveDonations from "./ActiveDonations";
import DonationHistory from "./DonationHistory";
import MetricCard from "../../../../components/MetricCard";
import api from "../../../../../services/api";
import { logout } from "../../../../../utils/token";
import { useNavigate } from "react-router-dom";
import LineTrendChart from "../../../../components/charts/LineTrendChart";
import StackedTrendBars from "../../../../components/charts/StackedTrendBars";
import DonutBreakdownChart from "../../../../components/charts/DonutBreakdownChart";

interface RestaurantDonation {
  _id: string;
  foodName: string;
  quantity: number;
  foodType: string;
  expiryTime: string;
  pickupAddress: string;
  status: "PENDING" | "ACCEPTED" | "PICKED_UP";
  ngo?: {
    organizationName: string;
  };
  createdAt: string;
}

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

  const [donations, setDonations] = useState<RestaurantDonation[]>([]);

  const navigate = useNavigate();

  const fetchDashboardData = () => {
    api.get("/donation/restaurant/dashboard").then((res) => {
      const d = res.data.donations as RestaurantDonation[];
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

  const trendData = useMemo(() => {
    const map = new Map<
      string,
      { label: string; total: number; pending: number; accepted: number; pickedUp: number; quantityKg: number }
    >();

    for (const donation of donations) {
      const label = new Date(donation.createdAt).toISOString().slice(0, 10);
      const bucket = map.get(label) || {
        label,
        total: 0,
        pending: 0,
        accepted: 0,
        pickedUp: 0,
        quantityKg: 0,
      };

      bucket.total += 1;
      bucket.quantityKg += donation.quantity || 0;
      if (donation.status === "PENDING") bucket.pending += 1;
      if (donation.status === "ACCEPTED") bucket.accepted += 1;
      if (donation.status === "PICKED_UP") bucket.pickedUp += 1;
      map.set(label, bucket);
    }

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [donations]);

  const statusMix = useMemo(
    () => [
      { name: "Pending", value: donations.filter((d) => d.status === "PENDING").length, color: "#f59e0b" },
      { name: "Accepted", value: donations.filter((d) => d.status === "ACCEPTED").length, color: "#3b82f6" },
      { name: "Picked Up", value: donations.filter((d) => d.status === "PICKED_UP").length, color: "#10b981" },
    ],
    [donations],
  );

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

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 sm:mt-8">
              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Donation Contribution Trend
                </h3>
                {trendData.length === 0 ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No trend data available
                  </div>
                ) : (
                  <LineTrendChart
                    data={trendData}
                    xKey="label"
                    series={[
                      { dataKey: "total", name: "Donations", color: "#7c3aed" },
                      { dataKey: "quantityKg", name: "Food (kg)", color: "#22c55e" },
                    ]}
                  />
                )}
              </div>

              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Donation Status Mix
                </h3>
                {statusMix.every((item) => item.value === 0) ? (
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    No status data available
                  </div>
                ) : (
                  <DonutBreakdownChart data={statusMix} />
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow p-4 sm:p-6 mt-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                Status Trend by Day
              </h3>
              {trendData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-500">
                  No status trend available
                </div>
              ) : (
                <StackedTrendBars
                  data={trendData}
                  xKey="label"
                  series={[
                    { dataKey: "pending", name: "Pending", color: "#f59e0b" },
                    { dataKey: "accepted", name: "Accepted", color: "#3b82f6" },
                    { dataKey: "pickedUp", name: "Picked Up", color: "#10b981" },
                  ]}
                />
              )}
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
