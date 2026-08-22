// -------- Admin Moderation Fetch Services --------
import { apiGet, apiPatch } from "@/lib/api-client";
import {
  ActiveStatus,
  Role,
  TApiResponse,
  TProperty,
  TRentalRequest,
} from "@/lib/types";

/****
 * Matches the exact payload of GET /api/admin/users
 * (backend selects only these fields — no timestamps).
 ****/
export type TAdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: ActiveStatus;
};

export interface IUserStatusUpdatePayload {
  activeStatus: ActiveStatus;
}

// 1. Fetch all platform users (tenants & landlords) via GET /api/admin/users

export async function getAllUsers(): Promise<TApiResponse<TAdminUser[]>> {
  return await apiGet<TAdminUser[]>("/api/admin/users", {
    next: { revalidate: 0 },
    cache: "no-store",
  });
}

// 2. Ban/Unban a user account via PATCH /api/admin/users/:userId

export async function updateUserStatus(
  userId: string,
  payload: IUserStatusUpdatePayload,
): Promise<TApiResponse<Partial<TAdminUser>>> {
  return await apiPatch<Partial<TAdminUser>>(
    `/api/admin/users/${userId}`,
    payload,
  );
}

// 3. Monitor all listed properties on the platform via GET /api/admin/properties

export async function getAllProperties(): Promise<
  TApiResponse<TProperty[]>
> {
  return await apiGet<TProperty[]>("/api/admin/properties", {
    next: { revalidate: 0 },
    cache: "no-store",
  });
}

// 4. Oversees all rental requests across the platform via GET /api/admin/rentals

export async function getAllRentals(): Promise<
  TApiResponse<TRentalRequest[]>
> {
  return await apiGet<TRentalRequest[]>("/api/admin/rentals", {
    next: { revalidate: 0 },
    cache: "no-store",
  });
}

export const adminService = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentals,
};
