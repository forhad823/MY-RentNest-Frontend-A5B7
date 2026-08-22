// -------- Rental Request Services --------
import { apiGet, apiPost } from "@/lib/api-client";
import { TApiResponse, TRentalRequest } from "@/lib/types";

export interface ISubmitRentalRequestPayload {
  propertyId: string;
  rentAmount: number;
}


//  * Submits a new rental request for a property via POST /api/rentals

export async function submitRentalRequest(
  payload: ISubmitRentalRequestPayload,
): Promise<TApiResponse<TRentalRequest>> {
  return await apiPost<TRentalRequest>("/api/rentals", payload);
}


//  * Fetches rental requests for the current user (or all if admin) via GET /api/rentals

export async function getRentalRequests(): Promise<TApiResponse<TRentalRequest[]>> {
  return await apiGet<TRentalRequest[]>("/api/rentals");
}


//  * Fetches a single rental request by ID via GET /api/rentals/:rentalReqId

export async function getRentalRequestById(
  rentalReqId: string,
): Promise<TApiResponse<TRentalRequest>> {
  return await apiGet<TRentalRequest>(`/api/rentals/${rentalReqId}`);
}

export const rentalService = {
  submitRentalRequest,
  getRentalRequests,
  getRentalRequestById,
};