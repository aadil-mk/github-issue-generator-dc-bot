import express from "express";
import { ENV } from "./config/env";
import { startBot } from "./services/bot";
import { logger } from "./utils/logger";
import { connectDB } from "./config/database";

// === Express Server Startup ===
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Github issues bot!");
});

app.listen(ENV.PORT, () => {
    logger.info(`Server is listening on port ${ENV.PORT}`);
});

// === Boot Sequence ===
connectDB().then(() => {
    startBot();
});
