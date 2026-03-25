import fs from "fs";
import path from "path";

const LOG_DIR = path.join(process.cwd(), "logs");
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const getErrorLogFilePath = () => {
    const date = new Date();
    const formattedDate = date.toISOString().split("T")[0];
    return path.join(LOG_DIR, `${formattedDate}-error.log`);
};

export const logger = {
    info: (message: string) => {
        console.log(`[INFO] ${message}`);
    },
    warn: (message: string) => {
        console.warn(`[WARN] ${message}`);
    },
    error: (context: string, error?: unknown) => {
        // Log to console for development visibility
        if (error) {
            console.error(`[ERROR] ${context}`, error);
        } else {
            console.error(`[ERROR] ${context}`);
        }

        // Build log payload
        const timestamp = new Date().toISOString();
        let errorMessage = "";
        if (error) {
            errorMessage = error instanceof Error 
                ? (error.stack || error.message)
                : String(error);
        }
            
        const logContent = `[${timestamp}] ${context}\n${errorMessage}\n\n`;

        // Write to daily error log append synchronously safely or asynchronously handled
        const filePath = getErrorLogFilePath();
        fs.appendFile(filePath, logContent, (err) => {
            if (err) console.error("Failed to write to log file:", err);
        });
    }
};