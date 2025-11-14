// ============================================
//  🔹 Create Intern Controller
// ============================================
import { CreateInternRequest } from "@/validator/intern.validator.js";
import type { Request, Response, NextFunction } from "express";
import { createInternService } from "@/services/intern.service.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.util.js";
import { successResponse } from "@/utils/index.util.js";

const createInternController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Call the create intern service
  const intern = await createInternService(req.body as CreateInternRequest);

  // Validate service response
  if (!intern) {
    logger.error("Failed to create intern", {
      label: "CreateInternController",
    });
    next(
      new APIError(500, "Failed to create intern", {
        type: "InternalServerError",
        details: [
          {
            field: "server",
            message: "Failed to create intern due to server error",
          },
        ],
      })
    );
  }

  // Log and send success response
  logger.info(`Intern created with ID: ${intern._id}`, {
    label: "CreateInternController",
  });
  successResponse(req, res, 201, "Intern created successfully", { intern });
};

export default createInternController;
