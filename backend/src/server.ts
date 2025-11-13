// ============================================
//  🔹 Server
// ============================================
import app from "@/app.js";
import {
	connectToDatabase,
	gracefullyShutDownDatabase,
} from "@/config/database.config.js";
import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";

// Port configuration
const PORT = config.PORT || 3001;

// ------------------------------------------------------
// 1️⃣ Start Server
// ------------------------------------------------------
const startServer = async () => {
	try {
		// Connect to the database
		await connectToDatabase();

		// Start the Express server
		const server = app.listen(PORT, () => {
			logger.info(`Server is running on http://localhost:${PORT}`);
		});

		// Gracefully handle shutdown
		process.on("SIGINT", async () => gracefullyShutDownDatabase(server));

		// Handle termination signal
		process.on("SIGTERM", async () => gracefullyShutDownDatabase(server));
	} catch (error) {
		logger.error("Failed to start server", {
			label: "Server",
			error,
		});
		process.exit(1);
	}
};

export default startServer;
