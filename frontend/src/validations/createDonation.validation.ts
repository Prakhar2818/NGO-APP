import * as yup from "yup";

export const createDonationSchema = yup.object({
  foodName: yup
    .string()
    .required("Food Name required")
    .min(1, "Atleast one food name is required"),
  quantity: yup
    .string()
    .required("Quantity Required")
    .min(1, "Minimum one quantity required"),
  expiryTime: yup
    .string()
    .required("Expiry date and time required")
    .min(1,"Date required"),
  foodType: yup
    .string()
    .required("Food type required")
    .min(1, "Select any one food type"),
  pickupAddress: yup
    .string()
    .required("Pickup address required")
    .min(1, "Address required"),
});
