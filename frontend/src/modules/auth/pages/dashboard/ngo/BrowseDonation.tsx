import { useEffect, useState } from "react";
import api from "../../../../../services/api";
import DonationCard from "../../../../components/DonationCard";
import { toast } from "react-toastify";

interface Donation {
  _id: string;
  foodName: string;
  quantity: number;
  restaurant: {
    name: string;
    address: string;
  };
}

const BrowseDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    api.get("/donation/browse").then((res) => {
      setDonations(res.data.donations);
    });
  }, []);

  const acceptDonation = async (id: string) => {
    await api.post(`/donation/${id}/accept`);
    toast.success("Donation accepted");
    setDonations((prev) => prev.filter((d) => d._id !== id));
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {donations.map((d) => (
        <DonationCard
          key={d._id}
          foodName={d.foodName}
          quantity={d.quantity}
          restaurantName={d.restaurant.name}
          address={d.restaurant.address}
          actionLabel="Accept"
          onAction={() => acceptDonation(d._id)}
        />
      ))}
    </div>
  );
};

export default BrowseDonations;
