import { UserRoles } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
        email: string;
        role: UserRoles;
      };
    }
  }
}

export {};
