import * as yup from "yup";

// Complete Registartion
export const completeRegistrationSchema = (role: "NGO" | "RESTAURANT") =>
  yup.object({
    organizationName:
      role === "NGO"
        ? yup
            .string()
            .trim()
            .min(2, "Organization name is required")
            .required("Organization name is required")
        : yup.string().notRequired(),

    restaurantName:
      role === "RESTAURANT"
        ? yup
            .string()
            .trim()
            .min(2, "Restaurant name is required")
            .required("Restaurant name is required")
        : yup.string().notRequired(),

    address: yup
      .string()
      .trim()
      .min(5, "Address is required")
      .required("Address is required"),

    phone: yup
      .string()
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
  });
