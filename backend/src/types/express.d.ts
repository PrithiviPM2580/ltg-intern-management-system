declare global {
  namespace Express {
    interface Request {
      startTime?: number;
      user?: {
        userId: string;
        role: "admin" | "intern";
      };
    }
  }
}

export {};
