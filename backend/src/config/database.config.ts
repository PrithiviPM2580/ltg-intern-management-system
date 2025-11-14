// ============================================
//  🔹 Database Config
// ============================================
import type { Server } from "node:http";
import mongoose, { type ConnectOptions } from "mongoose";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.util.js";
import config from "./env.config.js";

// ------------------------------------------------------
// 1️⃣ Database connection options
// ------------------------------------------------------
const connectOptions: ConnectOptions = {
	dbName: config.DB_NAME, // Database name
	appName: config.APP_NAME, // Application name
	serverApi: {
		version: "1",
		strict: true,
		deprecationErrors: true,
	},
	maxPoolSize: 50, // Maximum number of connections in the pool
	minPoolSize: 1, // Minimum number of connections in the pool
	connectTimeoutMS: 10000, // Connection timeout in milliseconds
	socketTimeoutMS: 45000, // Socket timeout in milliseconds
	retryWrites: true, // Enable retryable writes
};

let isConneccted = false;

// ------------------------------------------------------
// 2️⃣ Connected to database
// ------------------------------------------------------
export const connectToDatabase = async () => {
	// Validate DB_URI
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
		// Connect to MongoDB
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

// ------------------------------------------------------
// 3️⃣ Disconnect from database
// ------------------------------------------------------
export const disconnectFromDatabase = async () => {
	if (!isConneccted) return;

	try {
		// Disconnect from MongoDB
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

// ------------------------------------------------------
// 4️⃣ Gracefully shutdown the database
// ------------------------------------------------------
export const gracefullyShutDownDatabase = async (server: Server) => {
	logger.warn("Shutting down database connection...", {
		label: "DatabaseConfig",
	});
	try {
		// Disconnect from MongoDB gracefully
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
		// Close the server after database disconnection
		server.close(() => {
			logger.info("Server closed successfully", { label: "DatabaseConfig" });
			process.exit(0);
		});
	}
};
