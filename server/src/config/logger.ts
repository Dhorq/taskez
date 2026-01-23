import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "info",

  //   format: winston.format.simple(),
  //   format: winston.format.logstash(),
  //   format: winston.format.printf((log) => {
  //     return `${new Date()} : ${log.level.toUpperCase()} : ${log.message}`;
  //   }),
  //   format: winston.format.combine(
  //     winston.format.timestamp(),
  //     winston.format.ms(),
  //     winston.format.json(),
  //   ),

  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports: [
    new winston.transports.Console({ format: combine(colorize(), logFormat) }),
    new winston.transports.File({ filename: "logs/application.log" }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

// logger.log({ level: "error", message: "Hello Error" });
// logger.log({ level: "warn", message: "Hello Warn" });
// logger.log({ level: "info", message: "Hello Info" });
// logger.log({ level: "http", message: "Hello HTTP" });
// logger.log({ level: "verbose", message: "Hello Verbose" });
// logger.log({ level: "debug", message: "Hello Debug" });
// logger.log({ level: "silly", message: "Hello Silly" });

// logger.error("Error message");
// logger.warn("Warn message");
// logger.info("Info message");
// logger.http("Http message");
// logger.verbose("Verbose message");
// logger.debug("Debug message");
// logger.silly("Silly message");

export default logger;
