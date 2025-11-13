import { LoginRequest } from "@/validator/auth.validator.js";
import type { NextFunction, Request, Response } from "express";
import { loginService } from "@/services/auth.service.js";

const loginContoller = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // const {}= await loginService(req as LoginRequest);
};

export default loginContoller;
