// -------- Landlord CRUD & Management Services --------
import { apiGet, apiPost, apiPut, apiDelete, apiPatch } from "@/lib/api-client";
import { TApiResponse, TProperty, TRentalRequest } from "@/lib/types";

export interface IPropertyPayload {
  title: string;
  description?: string;
  location: string;
  price: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  availabilityStatus: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  categoryId: string;
  images?: string[];
}

export interface IUpdateRequestStatusPayload {
  status: "APPROVED" | "REJECTED";
}

// 1. Fetch landlord's properties
export async function getLandlordProperties(): Promise<
  TApiResponse<TProperty[]>
> {
  return await apiGet<TProperty[]>("/api/landlord/properties", {
    next: { revalidate: 0 },
  });
}

// 2. Create property listing
export async function createProperty(
  payload: IPropertyPayload,
): Promise<TApiResponse<TProperty>> {
  return await apiPost<TProperty>("/api/landlord/properties", payload);
}

// 3. Update property listing
export async function updateProperty(
  propertyId: string,
  payload: IPropertyPayload,
): Promise<TApiResponse<TProperty>> {
  return await apiPut<TProperty>(
    `/api/landlord/properties/${propertyId}`,
    payload,
  );
}

// 4. Delete property listing
export async function deleteProperty(
  propertyId: string,
): Promise<TApiResponse<null>> {
  return await apiDelete<null>(`/api/landlord/properties/${propertyId}`);
}

// 5. Fetch incoming tenant rental requests
export async function getLandlordRentalRequests(): Promise<
  TApiResponse<TRentalRequest[]>
> {
  return await apiGet<TRentalRequest[]>("/api/landlord/requests", {
    next: { revalidate: 0 },
  });
}

// 6. Approve/Reject incoming rental request
export async function updateRentalRequestStatus(
  rentalReqId: string,
  payload: IUpdateRequestStatusPayload,
): Promise<TApiResponse<Partial<TRentalRequest>>> {
  return await apiPatch<Partial<TRentalRequest>>(
    `/api/landlord/requests/${rentalReqId}`,
    payload,
  );
}

export const landlordService = {
  getLandlordProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getLandlordRentalRequests,
  updateRentalRequestStatus,
};
