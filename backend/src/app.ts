// ============================================
//  🔹 App
// ============================================

import cookieParser from "cookie-parser";
import express, { type Express } from "express";

// Create Express app
const app: Express = express();

// ------------------------------------------------------
// 1️⃣ Imports
// ------------------------------------------------------
import routes from "@/routes/index.routes.js";
import compressionMiddleware from "./middlewares/compression.middleware.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
import requestTimerMiddleware from "./middlewares/request-timer.middleware.js";

// ------------------------------------------------------
// 2️⃣ Middleware
// ------------------------------------------------------
app.use(cookieParser()); // parse cookies
app.use(compressionMiddleware); // use to compress responses
app.use(express.json()); // parse application/json so in the req.body we get json object
app.use(express.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(requestTimerMiddleware); // log request time
app.use(routes); // use routes
app.use(globalErrorHandler); // use global error handler

export default app;
