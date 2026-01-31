import * as yup from "yup";

export const createDonationSchema = yup.object({
  body: yup.object({
    foodName: yup.string().required(),
    quantity: yup.number().required().positive(),
    expiryTime: yup.date().required().min(new Date()),
    pickupAddress: yup.string().required(),
    foodType: yup.string().optional(),
  }),
});
