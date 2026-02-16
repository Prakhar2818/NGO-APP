import { useEffect, useMemo, useState } from "react";
import { HandHeart, Clock, CheckCircle, TrendingUp, Search, Users } from "lucide-react";
import Navbar from "../../../../components/Navbar";
import BrowseDonations from "./BrowseDonation";
import ActiveDonations from "./ActiveDonations";
import DonationHistory from "./DonationHistory";
import MetricCard from "../../../../components/MetricCard";
import NotificationPanel from "../../../../components/NotificationPanel";
import { socket, stopSocketCycle } from "../../../../../socket";
import { logout } from "../../../../../utils/token";
import { toast } from "react-toastify";
import api from "../../../../../services/api";
import { useNavigate } from "react-router-dom";
import LineTrendChart from "../../../../components/charts/LineTrendChart";
import StackedTrendBars from "../../../../components/charts/StackedTrendBars";
import DonutBreakdownChart from "../../../../components/charts/DonutBreakdownChart";

interface NgoDonation {
  _id: string;
  foodName?: string;
  quantity?: number;
  foodType?: string;
  status: "ACCEPTED" | "PICKED_UP" | "PENDING";
  acceptedAt?: string;
  pickedUpAt?: string;
  createdAt?: string;
  restaurant?: {
    restaurantName: string;
  };
}

const NGODashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "overview" | "browse" | "active" | "history"
  >("overview");

  const [stats, setStats] = useState({
    totalAccepted: 0,
    active: 0,
    completed: 0,
    pending: 0,
    meals: 0,
  });

  const [ngoDonations, setNgoDonations] = useState<NgoDonation[]>([]);

  const [notifications, setNotifications] = useState<any[]>(() => {
    const saved = localStorage.getItem("ngo-notifications");
    return saved ? JSON.parse(saved) : [];
  });
  const [showPanel, setShowPanel] = useState(false);
  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(
    () => localStorage.getItem("ngo-local-notifications") === "true",
  );
  const [notificationPermission, setNotificationPermission] =
    useState<NotificationPermission>(() => {
      if (typeof window === "undefined") return "default";
      if (!("Notification" in window)) return "denied";
      return Notification.permission;
    });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("ngo-notifications", JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.on("new-donation", (donation) => {
      setNotifications((p) => [
        {
          id: crypto.randomUUID?.() || Date.now().toString(),
          title: "New Donation",
          message: `${donation.foodName} (${donation.quantity})`,
          restaurantName: donation.restaurantName,
          createdAt: new Date().toISOString(),
        },
        ...p,
      ]);
      toast.info("New donation available");

      if (
        localNotificationsEnabled &&
        typeof window !== "undefined" &&
        "Notification" in window &&
        Notification.permission === "granted"
      ) {
        new Notification("New Donation Available", {
          body: `${donation.foodName} (${donation.quantity})`,
        });
      }
    });

    return () => {
      socket.off("new-donation");
    };
  }, []);

  const fetchDashboardData = () => {
    api.get("/donation/ngo/history").then((res) => {
      const d = res.data.donations as NgoDonation[];
      setNgoDonations(d);
      setStats({
        totalAccepted: d.length,
        active: d.filter((x: any) => x.status === "ACCEPTED").length,
        completed: d.filter((x: any) => x.status === "PICKED_UP").length,
        pending: d.filter((x: any) => x.status === "PENDING").length,
        meals: d.reduce((s: number, x: any) => s + (x.quantity || 0), 0),
      });
    });
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const trendData = useMemo(() => {
    const map = new Map<
      string,
      { label: string; total: number; accepted: number; pickedUp: number; quantityKg: number }
    >();

    for (const donation of ngoDonations) {
      const label = donation.acceptedAt
        ? new Date(donation.acceptedAt).toISOString().slice(0, 10)
        : donation.createdAt
        ? new Date(donation.createdAt).toISOString().slice(0, 10)
        : null;

      if (!label) continue;

      const bucket = map.get(label) || {
        label,
        total: 0,
        accepted: 0,
        pickedUp: 0,
        quantityKg: 0,
      };

      bucket.total += 1;
      bucket.quantityKg += donation.quantity || 0;
      if (donation.status === "ACCEPTED") bucket.accepted += 1;
      if (donation.status === "PICKED_UP") bucket.pickedUp += 1;
      map.set(label, bucket);
    }

    return Array.from(map.values()).sort((a, b) => a.label.localeCompare(b.label));
  }, [ngoDonations]);

  const statusMix = useMemo(
    () => [
      { name: "Active Pickups", value: stats.active, color: "#f59e0b" },
      { name: "Picked Up", value: stats.completed, color: "#10b981" },
    ],
    [stats],
  );

  const handleLogout = async () => {
    stopSocketCycle(true);
    try {
      await api.post("/auth/logout");
    } catch (error) {
      // Even if API call fails, clear local data
    } finally {
      logout();
      navigate("/login");
    }
  };

  const enableLocalNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Local notifications are not supported in this browser");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);

    if (permission === "granted") {
      localStorage.setItem("ngo-local-notifications", "true");
      setLocalNotificationsEnabled(true);
      toast.success("Local notifications enabled");
    } else {
      localStorage.setItem("ngo-local-notifications", "false");
      setLocalNotificationsEnabled(false);
      toast.info("Local notifications are disabled");
    }
  };

  return (
    <Navbar
      title="NGO Dashboard"
      tabs={[
        { key: "overview", label: "Overview" },
        { key: "browse", label: "Browse" },
        { key: "active", label: "Active" },
        { key: "history", label: "History" },
      ]}
      activeTab={activeTab}
      onTabChange={(k) => setActiveTab(k as any)}
      showNotificationBell
      notificationCount={notifications.length}
      onBellClick={() => setShowPanel((p) => !p)}
      rightSlot={
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
        >
          Logout
        </button>
      }
    >
      {showPanel && (
        <div className="absolute top-16 right-4 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <NotificationPanel
            notifications={notifications}
            onClose={() => setShowPanel(false)}
            localNotificationsEnabled={localNotificationsEnabled}
            notificationPermission={notificationPermission}
            onEnableLocalNotifications={enableLocalNotifications}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            {activeTab === "overview" && "Dashboard Overview"}
            {activeTab === "browse" && "Browse Available Donations"}
            {activeTab === "active" && "Active Donations"}
            {activeTab === "history" && "Donation History"}
          </h2>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {activeTab === "overview" && "Track your pickup impact and statistics"}
            {activeTab === "browse" && "Find and accept available donations from restaurants"}
            {activeTab === "active" && "Manage your ongoing pickups"}
            {activeTab === "history" && "View your completed pickups"}
          </p>
        </div>

        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              <MetricCard
                label="Total Accepted"
                value={stats.totalAccepted}
                icon={<HandHeart className="w-4 h-4 sm:w-5 sm:h-5" />}
              />
              <MetricCard
                label="Meals Received"
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
                  onClick={() => setActiveTab("browse")}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors text-sm sm:text-base"
                >
                  <Search size={16} className="sm:w-[18px] sm:h-[18px]" />
                  Browse Donations
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
                  Pickup Trend
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
                      { dataKey: "quantityKg", name: "Food", color: "#22c55e" },
                    ]}
                  />
                )}
              </div>

              <div className="bg-white rounded-xl shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                  Pickup Status Mix
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
                    { dataKey: "accepted", name: "Accepted", color: "#3b82f6" },
                    { dataKey: "pickedUp", name: "Picked Up", color: "#10b981" },
                  ]}
                />
              )}
            </div>
          </>
        )}

        {activeTab === "browse" && <BrowseDonations />}
        {activeTab === "active" && (
          <ActiveDonations />
        )}
        {activeTab === "history" && (
          <DonationHistory />
        )}
      </div>
    </Navbar>
  );
};

export default NGODashboard;
