import express from "express";
import { ENV } from "./utils/constants";
import { startBot } from "./services/bot";

// === Express Server Startup ===
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Github issues bot!");
});

app.listen(ENV.PORT, () => {
    console.log(`Server is listening on port ${ENV.PORT}`);
});

// === Discord Bot Startup ===
startBot();
