import { users, seller } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: users|null
      seller?: seller|null
      role?: "user" | "seller"
    }
  }
}