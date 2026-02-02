import DonationCard from "../../../../components/DonationCard";

const DonationHistory = ({ donations = [] }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {donations.length === 0 ? (
      <div className="col-span-full text-center py-8 text-gray-500">
        No donation history found.
      </div>
    ) : (
      donations.map((d: any) => (
        <DonationCard
          key={d._id}
          foodName={d.foodName}
          quantity={d.quantity}
          ngoName={d.ngo?.organizationName}
          status={d.status}
          tags={["Completed", "Picked Up"]}
          footerText={d.pickedUpAt
            ? `Picked up on: ${new Date(d.pickedUpAt).toLocaleDateString()}`
            : "Picked up"}
          expiryTime={d.expiryTime}
        />
      ))
    )}
  </div>
);

export default DonationHistory;
