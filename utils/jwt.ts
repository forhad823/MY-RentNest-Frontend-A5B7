/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "@/lib/types";

// -------- Shape of our backend's JWT payload --------
export interface TDecodedToken extends JwtPayload {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;
}

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);
    return {
      success: true,
      data: verifiedToken,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const jwtUtils = {
  verifyToken,
};
