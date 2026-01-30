import { ValidationError } from "yup";
export const validate = (schema) => async (req, res, next) => {
    try {
        const validationSchema = typeof schema === "function" ? schema(req) : schema;
        await validationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        next();
    }
    catch (error) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                success: false,
                message: error.errors[0],
                errors: error.errors,
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: "Validation failed",
        });
    }
};
