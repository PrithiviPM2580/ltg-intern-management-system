import type { NextFunction, Request, Response } from "express";
import { logRequest } from "@/utils/index.utils.js";

const requestTimerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.startTime = Date.now();

  res.on("finish", () => {
    const responseTime = Date.now() - res.locals.startTime;
    res.locals.responseTime = `${responseTime}ms`;
  });
  next();
};

export default requestTimerMiddleware;
