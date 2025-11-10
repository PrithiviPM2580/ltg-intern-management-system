import app from "app.js";

const PORT = 3000;

const startServer = async () => {
	app.listen(PORT, () => {
		console.log(`Server is running on http://localhost:${PORT}`);
	});
};

export default startServer;
