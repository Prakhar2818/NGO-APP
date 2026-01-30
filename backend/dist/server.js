import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";
const startServer = async () => {
    try {
        await connectDB();
        const port = Number(env.port);
        app.listen(port, () => {
            console.log(`Server is running on PORT ${env.port}`);
        });
    }
    catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();
