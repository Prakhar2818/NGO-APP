import { TrendingUp, Clock, CheckCircle, Users } from 'lucide-react';
import Card from './ui/Card';
import MetricCard from './MetricCard';

interface Stats {
  totalAccepted: number;
  active: number;
  completed: number;
  pending: number;
}

interface DashboardOverviewProps {
  stats: Stats;
  chartData?: any[];
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ stats, chartData }) => {
  const metricData = [
    {
      label: "Total Accepted",
      value: stats.totalAccepted,
      icon: <Users className="text-primary-600" size={24} />,
      trend: "+12%",
      trendUp: true
    },
    {
      label: "Active Donations",
      value: stats.active,
      icon: <Clock className="text-yellow-600" size={24} />,
      trend: "+5%",
      trendUp: true
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: <CheckCircle className="text-green-600" size={24} />,
      trend: "+18%",
      trendUp: true
    },
    {
      label: "Pending Approval",
      value: stats.pending,
      icon: <Clock className="text-orange-600" size={24} />,
      trend: "-3%",
      trendUp: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricData.map((metric, index) => (
          <MetricCard
            key={index}
            label={metric.label}
            value={metric.value}
            icon={metric.icon}
            trend={metric.trend}
            trendUp={metric.trendUp}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Activity chart visualization</p>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-4">Impact Over Time</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Impact chart visualization</p>
          </div>
        </Card>
      </div>

      {/* Recent Donations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">Recent Donations</h3>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="text-primary-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Donation #{1000 + item}</h4>
                  <p className="text-sm text-gray-500">Restaurant Name • 2 hours ago</p>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                  Completed
                </span>
                <p className="text-sm text-gray-500 mt-1">50 meals</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardOverview;