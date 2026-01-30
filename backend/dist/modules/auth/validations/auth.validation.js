import * as yup from "yup";
const emailFormat = yup
    .string()
    .min(2, "Email Required")
    .email("Invalid email format");
export const registerSchema = yup.object({
    name: yup.string().min(2, "Name is required").required("Name is required"),
    email: emailFormat,
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required(),
    role: yup
        .mixed()
        .oneOf(["NGO", "RESTAURANT", "ADMIN"], "Invalid role selected")
        .required(),
});
export const loginSchema = yup.object({
    email: emailFormat,
    password: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required(),
});
export const forgotPasswordSchema = yup.object({
    email: emailFormat,
});
export const resetPasswordSchema = yup.object({
    email: emailFormat,
    otp: yup.string().min(6, "OTP required").required("OTP required"),
    newPassword: yup
        .string()
        .min(6, "Password must be at least 6 characters")
        .required(),
});
export const completeRegistrationSchema = (req) => {
    const role = req.user?.role;
    let baseSchema = {
        address: yup
            .string()
            .min(1, "Address Required")
            .required("Address Required"),
    };
    if (role === "NGO") {
        baseSchema = {
            ...baseSchema,
            organizationName: yup
                .string()
                .min(2, "Organization name required")
                .required("Organization name required"),
        };
    }
    if (role === "RESTAURANT") {
        baseSchema = {
            ...baseSchema,
            restaurantName: yup
                .string()
                .min(2, "Restaurant name required")
                .required("Restaurant name required"),
        };
    }
    return yup.object(baseSchema);
};
