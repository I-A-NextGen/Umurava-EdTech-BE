import { UserRoles } from "../models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRoles;
      };
    }
  }
}

export {};
