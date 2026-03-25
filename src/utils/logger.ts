import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR);
}

const getTimestamp = (): string => {
  return new Date().toISOString();
};

const getErrorLogFilePath = () => {
  const date = new Date();
  const formattedDate = date.toISOString().split("T")[0];
  return path.join(LOG_DIR, `${formattedDate}-error.log`);
};

export const logger = {
  info: (message: string) => {
    console.log(`[INFO] [${getTimestamp()}] ${message}`);
  },
  warn: (message: string) => {
    console.warn(`[WARN] [${getTimestamp()}] ${message}`);
  },
  error: (context: string, error?: unknown) => {
    const timestamp = getTimestamp();

    if (error) {
      console.error(`[ERROR] [${timestamp}] ${context}`, error);
    } else {
      console.error(`[ERROR] [${timestamp}] ${context}`);
    }

    let errorMessage = "";
    if (error) {
      errorMessage =
        error instanceof Error ? error.stack || error.message : String(error);
    }

    const logContent = `[${timestamp}] ${context}\n${errorMessage}\n\n`;

    const filePath = getErrorLogFilePath();
    fs.appendFile(filePath, logContent, (err) => {
      if (err) console.error("Failed to write to log file:", err);
    });
  },
};
