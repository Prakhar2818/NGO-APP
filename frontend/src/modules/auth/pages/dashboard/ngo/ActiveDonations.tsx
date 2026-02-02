import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";
import { toast } from "react-toastify";

const ActiveDonations = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    api.get("/donation/ngo/history").then((res) => {
      setData(res.data.donations.filter((d: any) => d.status === "ACCEPTED"));
    });
  }, []);

  const markPicked = async (id: string) => {
    await api.patch(`/donation/${id}/pickup`);
    toast.success("Marked as picked up");
    setData((p) => p.filter((x) => x._id !== id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.length === 0 ? (
        <div className="col-span-full text-center py-8 text-gray-500">
          No active donations found.
        </div>
      ) : (
        data.map((d) => (
          <DonationCard
            key={d._id}
            foodName={d.foodName}
            quantity={d.quantity}
            restaurantName={d.restaurant?.name}
            address={d.restaurant?.address}
            status={d.status}
            tags={["Accepted", "Ready for pickup"]}
            actionLabel="Mark Picked Up"
            onAction={() => markPicked(d._id)}
            expiryTime={d.expiryTime}
          />
        ))
      )}
    </div>
  );
};

export default ActiveDonations;
