interface Props {
  label: string;
  value: number | string;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

const MetricCard: React.FC<Props> = ({ label, value, icon, trend, trendUp }) => (
  <div className="bg-white rounded-xl shadow p-3 sm:p-5 hover:shadow-md transition-shadow font-mono">
    <div className="flex items-start justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-gray-500 text-xs sm:text-sm truncate">{label}</p>
        <p className="text-xl sm:text-3xl font-bold text-purple-700 mt-1">{value}</p>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
            {trendUp ? "↑" : "↓"} {trend}
          </p>
        )}
      </div>
      {icon && (
        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0 ml-2">
          {icon}
        </div>
      )}
    </div>
  </div>
);

export default MetricCard;
