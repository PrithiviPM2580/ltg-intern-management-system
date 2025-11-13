// ============================================
//  🔹 Auth Service
// ============================================
import config from "@/config/env.config.js";
import {
  createIntern,
  createToken,
  deleteRefreshToken,
  findInternByEmail,
  isInternEmailExist,
} from "@/dao/auth.dao.js";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";
import { generateMongooseId, sevenDaysFromNow } from "@/utils/index.utils.js";
import type {
  LoginRequest,
  SignupRequest,
} from "@/validator/auth.validator.js";
import { Types } from "mongoose";

// ------------------------------------------------------
// 1️⃣ Register Service
// ------------------------------------------------------
export const signupService = async (data: SignupRequest) => {
  const { email } = data;

  const role = config.ADMIN_EMAIL.includes(email) ? "admin" : "intern";

  // Intern login validation
  const internExists = await isInternEmailExist(email);
  if (internExists) {
    logger.warn(`Intern already exist with email: ${email}`, {
      label: "AuthService",
    });
    throw new APIError(404, "Intern already exist with the provided email", {
      type: "NotFoundError",
      details: [
        {
          field: "email",
          message: "No intern found with the provided email",
        },
      ],
    });
  }

  // Generate new intern ID
  const internId = generateMongooseId();

  // Create the intern
  const intern = await createIntern(
    { ...data, role: role || "intern" },
    internId
  );

  // Access token & Refresh token generation
  const refreshToken = generateRefreshToken({
    internId: internId,
    role: role || "intern",
  });

  const accessToken = generateAccessToken({
    internId: internId,
    role: role || "intern",
  });

  // Store refresh token in DB
  await createToken({
    _id: generateMongooseId(),
    internId: internId,
    token: refreshToken,
    expiresAt: sevenDaysFromNow(),
  });

  // Return intern data along with tokens
  return {
    intern: {
      _id: intern._id,
      username: intern.username,
      email: intern.email,
      role: intern.role,
      approvalStatus: intern.approvalStatus,
    },
    accessToken,
    refreshToken,
  };
};

// ------------------------------------------------------
// 2️⃣ Login Service
// ------------------------------------------------------
export const loginService = async (data: LoginRequest) => {
  const { email, password } = data;

  // Intern login validation
  const intern = await findInternByEmail(email);
  if (!intern) {
    logger.error(`No intern found with email: ${email}`, {
      label: "AuthService",
    });
    throw new APIError(404, "No intern found with the provided email", {
      type: "NotFoundError",
      details: [
        {
          field: "email",
          message: "No intern found with the provided email",
        },
      ],
    });
  }

  // Check if intern is approved
  if (intern.approvalStatus !== "approved") {
    logger.warn(`Intern with email: ${email} is not approved`, {
      label: "AuthService",
    });
    throw new APIError(403, "Intern is not approved yet", {
      type: "ForbiddenError",
      details: [
        {
          field: "approvalStatus",
          message: "Intern approval is pending or rejected",
        },
      ],
    });
  }

  // Validate password
  if (!intern.comparePassword) {
    logger.error(
      `Password comparison method not found for intern with email: ${email}`,
      {
        label: "AuthService",
      }
    );
    throw new APIError(500, "Internal server error", {
      type: "InternalServerError",
    });
  }

  // Validate password
  const isPasswordValid = await intern.comparePassword(password);
  if (!isPasswordValid) {
    logger.warn(`Invalid password for intern with email: ${email}`, {
      label: "AuthService",
    });
    throw new APIError(401, "Invalid password", {
      type: "UnauthorizedError",
      details: [
        {
          field: "password",
          message: "The provided password is incorrect",
        },
      ],
    });
  }

  const userId = intern._id;

  // Access token & Refresh token generation
  const refreshToken = generateRefreshToken({
    internId: userId,
    role: intern.role,
  });

  const accessToken = generateAccessToken({
    internId: userId,
    role: intern.role,
  });

  // Store refresh token in DB
  await createToken({
    _id: generateMongooseId(),
    internId: userId,
    token: refreshToken,
    expiresAt: sevenDaysFromNow(),
  });

  // Return intern data along with tokens
  return {
    intern: {
      _id: intern._id,
      username: intern.username,
      email: intern.email,
      role: intern.role,
      approvalStatus: intern.approvalStatus,
    },
    accessToken,
    refreshToken,
  };
};

// ------------------------------------------------------
// 3️⃣ Logout Service
// ------------------------------------------------------
export const logoutService = async (
  internId?: Types.ObjectId
): Promise<boolean> => {
  if (!internId) {
    logger.error(`Intern ID is required for logout`, {
      label: "AuthService",
    });
    throw new APIError(400, "Bad Request - Intern ID is required", {
      type: "BadRequestError",
      details: [
        {
          field: "internId",
          message: "Intern ID is required for logout",
        },
      ],
    });
  }

  const isRefreshTokenDeleted = await deleteRefreshToken(internId);
  if (!isRefreshTokenDeleted.acknowledged) {
    logger.error(`Failed to delete refresh token for intern ID: ${internId}`, {
      label: "AuthService",
    });
    throw new APIError(500, "Internal Server Error - Logout failed", {
      type: "InternalServerError",
    });
  }
  logger.info(`Intern with ID: ${internId} logged out successfully`, {
    label: "AuthService",
  });
  return true;
};
