import { useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";

interface Donation {
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
}

const ActiveDonations = ({ donations = [], onDonationUpdated }: { donations: Donation[]; onDonationUpdated?: () => void }) => {
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [formData, setFormData] = useState({
    foodName: "",
    quantity: "",
    foodType: "veg",
    expiryTime: "",
    pickupAddress: "",
  });

  const deleteDonation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this donation?")) return;
    try {
      await api.delete(`/donation/${id}`);
      if (onDonationUpdated) {
        onDonationUpdated();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to delete donation");
    }
  };

  const startEditing = (donation: Donation) => {
    setEditingDonation(donation);
    setFormData({
      foodName: donation.foodName,
      quantity: donation.quantity.toString(),
      foodType: donation.foodType || "veg",
      expiryTime: donation.expiryTime ? new Date(donation.expiryTime).toISOString().slice(0, 16) : "",
      pickupAddress: donation.pickupAddress || "",
    });
  };

  const cancelEditing = () => {
    setEditingDonation(null);
    setFormData({
      foodName: "",
      quantity: "",
      foodType: "veg",
      expiryTime: "",
      pickupAddress: "",
    });
  };

  const updateDonation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonation) return;

    try {
      await api.patch(`/donation/${editingDonation._id}`, {
        ...formData,
        quantity: Number(formData.quantity),
      });
      setEditingDonation(null);
      if (onDonationUpdated) {
        onDonationUpdated();
      } else {
        window.location.reload();
      }
    } catch (error) {
      alert("Failed to update donation");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donations.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No active donations found.
          </div>
        ) : (
          donations.map((d: Donation) => (
            <DonationCard
              key={d._id}
              foodName={d.foodName}
              quantity={d.quantity}
              ngoName={d.ngo?.organizationName}
              status={d.status}
              tags={d.status === "PENDING" ? ["Pending Approval"] : ["Accepted"]}
              showEditButton={d.status === "PENDING"}
              onEdit={() => startEditing(d)}
              showDeleteButton={d.status === "PENDING"}
              onDelete={() => deleteDonation(d._id)}
              footerText={d.ngo?.organizationName ? `Accepted by: ${d.ngo.organizationName}` : "Waiting for NGO to accept"}
            />
          ))
        )}
      </div>

      {/* Edit Modal */}
      {editingDonation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Edit Donation</h2>
              <form onSubmit={updateDonation} className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Name</label>
                  <input
                    type="text"
                    value={formData.foodName}
                    onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (meals)</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
                  <select
                    value={formData.foodType}
                    onChange={(e) => setFormData({ ...formData, foodType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="veg">Vegetarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                    <option value="both">Both</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Time</label>
                  <input
                    type="datetime-local"
                    value={formData.expiryTime}
                    onChange={(e) => setFormData({ ...formData, expiryTime: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address</label>
                  <textarea
                    value={formData.pickupAddress}
                    onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg p-2 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    rows={2}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ActiveDonations;
