//* ====== Imports ====== *//
import express from "express";
import { ENV } from "./config/env";
import { startBot } from "./services/bot";
import logger from "./utils/logger";
import { connectDB } from "./config/database";

//* ====== Server Initialization ====== *//
const app = express();

//* ====== Middleware ====== *//
app.use(express.json());

//* ====== Routes ====== *//
app.get("/", (req, res) => {
  res.send("Github issues bot!");
});

const server = app.listen(ENV.PORT, () => {
  logger.log(`Server is listening on port ${ENV.PORT}`);
});

server.on("error", (err) => {
  logger.error("Express server error", err);
  process.exit(1);
});

//* ====== Application Startup ====== *//
(async () => {
  try {
    await connectDB();
    await startBot();
  } catch (err) {
    logger.error("Failed to boot application", err);
    process.exit(1);
  }
})();
