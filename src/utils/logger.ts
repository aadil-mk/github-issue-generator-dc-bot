//* ====== Imports ====== *//
import pino from "pino";

//* ====== Transport Configuration ====== *//
const prettyTransport = pino.transport({
  target: require.resolve("pino-pretty"),
  options: {
    colorize: true,
    translateTime: "yyyy-mm-dd HH:mm:ss",
    ignore: "pid,hostname",
    singleLine: false,
    hideObject: true,
    customColors: "info:blue,warn:yellow,error:red",
  },
});

const today = new Date();

//* ====== Logger Class Implementation ====== *//
class Logger {
  private _pinoLogger = pino(
    { level: "debug" },
    pino.multistream([
      { level: "info", stream: prettyTransport },
      {
        level: "debug",
        stream: pino.destination({
          dest: `${process.cwd()}/logs/combined-${today.getFullYear()}.${
            today.getMonth() + 1
          }.${today.getDate()}.log`,
          sync: true,
          mkdir: true,
        }),
      },
    ]),
  );

  success(content: string) {
    this._pinoLogger.info(content);
  }

  log(content: string) {
    this._pinoLogger.info(content);
  }

  warn(content: string) {
    this._pinoLogger.warn(content);
  }

  error(content: string, ex?: unknown) {
    if (ex) {
      const msg = ex instanceof Error ? ex.message : String(ex);
      this._pinoLogger.error(ex, `${content}: ${msg}`);
    } else {
      this._pinoLogger.error(content);
    }
  }

  debug(content: string) {
    this._pinoLogger.debug(content);
  }
}

//* ====== Logger Instance Export ====== *//
const logger = new Logger();

export default logger;
