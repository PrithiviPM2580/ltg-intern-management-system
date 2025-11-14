// ============================================
//  🔹 Auth Service
// ============================================

import { Types } from "mongoose";
import config from "@/config/env.config.js";
import {
  createIntern,
  createToken,
  deleteRefreshToken,
  findInternByEmail,
  isInternEmailExist,
  isTokenExist,
} from "@/dao/auth.dao.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/lib/jwt.lib.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";
import { generateMongooseId, sevenDaysFromNow } from "@/utils/index.utils.js";
import type {
  LoginRequest,
  SignupRequest,
} from "@/validator/auth.validator.js";

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

  // Convert internId to string
  const internIdString = internId.toString();

  // Create the intern
  const intern = await createIntern(
    { ...data, role: role || "intern" },
    internId
  );

  // Access token & Refresh token generation
  const refreshToken = generateRefreshToken({
    internId: internIdString,
    role: role || "intern",
  });

  const accessToken = generateAccessToken({
    internId: internIdString,
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
  if (intern.role === "intern" && intern.approvalStatus !== "approved") {
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

  // Get intern ID
  const userId = intern._id;

  // Convert internId to string
  const userIdString = userId.toString();

  // Access token & Refresh token generation
  const refreshToken = generateRefreshToken({
    internId: userIdString,
    role: intern.role,
  });

  const accessToken = generateAccessToken({
    internId: userIdString,
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
export const logoutService = async (token: string): Promise<boolean> => {
  // Validate token
  if (!token) {
    logger.error(`Token is required for logout`, {
      label: "AuthService",
    });
    throw new APIError(400, "Bad Request - Token is required", {
      type: "BadRequestError",
      details: [
        {
          field: "token",
          message: "Token is required for logout",
        },
      ],
    });
  }

  // Delete refresh token from DB
  const isRefreshTokenDeleted = await deleteRefreshToken(token);
  if (!isRefreshTokenDeleted.acknowledged) {
    logger.error(`Failed to delete refresh token for token: ${token}`, {
      label: "AuthService",
    });
    throw new APIError(500, "Internal Server Error - Logout failed", {
      type: "InternalServerError",
    });
  }
  // Log successful logout
  logger.info(`Token: ${token} logged out successfully`, {
    label: "AuthService",
  });
  return true;
};

// ------------------------------------------------------
// 4️⃣ Refresh Token Service
// ------------------------------------------------------
export const refreshTokenService = async (oldToken: string) => {
  const jwtPayload = verifyRefreshToken(oldToken) as TokenPayload;

  const isToken = await isTokenExist(oldToken);
  if (!isToken) {
    logger.warn(`Refresh token does not exist in DB`, {
      label: "AuthService",
    });
    throw new APIError(401, "Invalid refresh token", {
      type: "UnauthorizedError",
      details: [
        {
          field: "refreshToken",
          message: "The provided refresh token is invalid or has been revoked",
        },
      ],
    });
  }

  const newAccessToken = generateAccessToken({
    internId: jwtPayload.internId,
    role: jwtPayload.role,
  });
  const newRefreshToken = generateRefreshToken({
    internId: jwtPayload.internId,
    role: jwtPayload.role,
  });

  await deleteRefreshToken(oldToken);

  await createToken({
    _id: generateMongooseId(),
    internId: new Types.ObjectId(jwtPayload.internId),
    token: newRefreshToken,
    expiresAt: sevenDaysFromNow(),
  });

  return { newAccessToken, newRefreshToken };
};
