import mongoose, { ConnectOptions } from "mongoose";
import { APIError } from "@/utils/index.utils.js";
import logger from "@/lib/logger.lib.js";
import config from "./env.config.js";

const connectOptions: ConnectOptions = {
  dbName: config.DB_NAME,
  appName: config.APP_NAME,
  serverApi: {
    version: "1",
    strict: true,
    deprecationErrors: true,
  },
  maxPoolSize: 10,
  minPoolSize: 1,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
};

let isConneccted = false;

export const connectToDatabase = async () => {
  if (!config.DB_URI) {
    logger.error("Database URI is not defined in environment variables", {
      label: "DatabaseConfig",
    });
    throw new APIError(500, "Database URI is not defined", {
      type: "DatabaseError",
      details: [
        {
          field: "DB_URI",
          message:
            "Missing database connection string in environment variables",
        },
      ],
    });
  }

  if (isConneccted) return;

  try {
    await mongoose.connect(config.DB_URI, connectOptions);
    isConneccted = true;
    logger.info("Connected to the database successfully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Failed to connect to the database", {
      label: "DatabaseConfig",
      error,
    });
    throw new APIError(500, "Failed to connect to the database", {
      type: "DatabaseError",
      details: [
        {
          message:
            (error as Error).message ||
            "Unknown error occurred while connecting to database",
        },
      ],
    });
  }
};

export const disconnectFromDatabase = async () => {
  if (!isConneccted) return;

  try {
    await mongoose.disconnect();
    isConneccted = false;
    logger.info("Disconnected from the database successfully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Failed to disconnect from the database", {
      label: "DatabaseConfig",
      error,
    });
    throw new APIError(500, "Failed to disconnect from the database", {
      type: "DatabaseError",
      details: [
        {
          message:
            (error as Error).message ||
            "Unknown error occurred while disconnecting from database",
        },
      ],
    });
  }
};

export const gracefullyShutDownDatabase = async (server: any) => {
  logger.warn("Shutting down database connection...", {
    label: "DatabaseConfig",
  });
  try {
    await disconnectFromDatabase();
    logger.info("Database connection shut down gracefully", {
      label: "DatabaseConfig",
    });
  } catch (error) {
    logger.error("Error during database shutdown", {
      label: "DatabaseConfig",
      error,
    });
  } finally {
    server.close(() => {
      logger.info("Server closed successfully", { label: "DatabaseConfig" });
      process.exit(0);
    });
  }
};
