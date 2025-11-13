import config from "@/config/env.config.js";
import logger from "@/lib/logger.lib.js";
import APIError from "@/utils/errors.utils.js";
import { LoginRequest } from "@/validator/auth.validator.js";

export const loginService = async (data: LoginRequest) => {
  const { email, username, password, role } = data;
  if (role === "admin" && !config.ADMIN_EMAIL?.includes(email)) {
    logger.warn(`Unauthorized admin login attempt: ${email}`, {
      label: "AuthService",
    });
    throw new APIError(401, "Unauthorized admin login attempt", {
      type: "UnauthorizedError",
      details: [
        {
          field: "email",
          message: "Email is not registered as admin",
        },
      ],
    });
  }
  //   const isAdminExist = await isAdminExistByEmail(email);
};
