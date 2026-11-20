import "dotenv/config";
import { createApp } from "./app.js"
import { connectDB } from "./config/db.js"

const PORT = Number(process.env.PORT) || 5000;
const app = createApp();

connectDB(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server listening on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to connect to the database:", err);
        process.exit(1);
    });