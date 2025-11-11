import type { Request, Response, NextFunction } from "express";
import { logRequest } from "utils/index.utils.js";

const requestTimerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.startTime = Date.now();

  res.on("finish", () => {
    logRequest({ req, res });
  });
  next();
};

export default requestTimerMiddleware;
