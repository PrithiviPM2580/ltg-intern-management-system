import app from "app.js";
import config from "config/env.config.js";

const PORT = config.PORT || 3001;

const startServer = async () => {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};

export default startServer;
