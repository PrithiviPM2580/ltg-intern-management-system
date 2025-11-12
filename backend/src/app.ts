// ============================================
//  🔹 App Section
// ============================================
import express, { type Express } from "express";
const app: Express = express();

// ------------------------------------------------------
// 1️⃣ Imports
// ------------------------------------------------------
import routes from "@/routes/index.routes.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
import requestTimerMiddleware from "./middlewares/request-timer.middleware.js";
import compressionMiddleware from "./middlewares/compression.middleware.js";

// ------------------------------------------------------
// 2️⃣ Middleware
// ------------------------------------------------------

app.use(compressionMiddleware); // use to compress responses
app.use(express.json()); // parse application/json so in the req.body we get json object
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(requestTimerMiddleware); // log request time
app.use(routes); // use routes
app.use(globalErrorHandler); // use global error handler

export default app;
