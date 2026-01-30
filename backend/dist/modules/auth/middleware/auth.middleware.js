import { verifyToken } from "../../../utils/jwt.js";
export const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Inavalid or expired token",
        });
    }
};
