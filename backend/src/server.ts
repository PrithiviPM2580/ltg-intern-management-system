import app from "@/app.js";
import {
  connectToDatabase,
  gracefullyShutDownDatabase,
} from "@/config/database.config.js";
import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";

const PORT = config.PORT || 3001;

const startServer = async () => {
  try {
    await connectToDatabase();
    const server = app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
    process.on("SIGINT", async () => gracefullyShutDownDatabase(server));
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
