import StatusBadge from "./StatusBadge";

interface DonationCardProps {
  foodName: string;
  quantity: number;
  restaurantName?: string;
  address?: string;
  status?: "PENDING" | "ACCEPTED" | "PICKED_UP";
  actionLabel?: string;
  onAction?: () => void;
  footerText?: string;
  ngoName?: string;
  tags?: string[];
  showEditButton?: boolean;
  onEdit?: () => void;
  showDeleteButton?: boolean;
  onDelete?: () => void;
  expiryTime?: string;
}

const DonationCard: React.FC<DonationCardProps> = ({
  foodName,
  quantity,
  restaurantName,
  address,
  status,
  actionLabel,
  onAction,
  footerText,
  ngoName,
  tags = [],
  showEditButton,
  onEdit,
  showDeleteButton,
  onDelete,
  expiryTime,
}) => {
  const formatExpiryTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
      {/* Header with avatar and save button */}
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-base sm:text-lg flex-shrink-0">
            {restaurantName ? restaurantName.charAt(0).toUpperCase() : "D"}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {restaurantName || ngoName || "Donation"}
            </h4>
            <span className="text-xs text-gray-400">{status || "Pending"}</span>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      {/* Main content */}
      <div className="mb-3 sm:mb-4">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">
          {foodName}
        </h3>
        <p className="text-gray-600 text-sm">
          Quantity: <span className="font-semibold">{quantity} meals</span>
        </p>
        {expiryTime && (
          <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
            <span>
              Expires:{" "}
              <span className="font-semibold text-orange-600">
                {formatExpiryTime(expiryTime)}
              </span>
            </span>
          </p>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Address */}
      {address && (
        <p className="text-gray-500 text-sm mb-3 sm:mb-4 flex items-center gap-1">
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span className="truncate">{address}</span>
        </p>
      )}

      {/* Footer with action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3">
        {footerText && (
          <p className="text-xs text-gray-400 order-2 sm:order-1">
            {footerText}
          </p>
        )}
        <div className="flex gap-2 order-1 sm:order-2">
          {showEditButton && onEdit && (
            <button
              onClick={onEdit}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Edit
            </button>
          )}
          {showDeleteButton && onDelete && (
            <button
              onClick={onDelete}
              className="flex-1 sm:flex-none bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              Delete
            </button>
          )}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="flex-1 sm:flex-none bg-purple-600 hover:bg-purple-700 text-white px-4 sm:px-5 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationCard;
