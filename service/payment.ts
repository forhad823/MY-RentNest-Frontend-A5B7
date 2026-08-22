// -------- Payment Fetch & Initiation Services --------
import { apiGet, apiPost } from "@/lib/api-client";
import { TApiResponse, TPayment } from "@/lib/types";

export interface ICreateCheckoutPayload {
  rentalRequestId: string;
}

export interface ICreateCheckoutResponse {
  paymentId: string;
  sessionId: string;
  checkoutUrl: string;
}


//  * Creates a Stripe checkout session for an approved rental request via POST /api/payments/create

export async function createCheckoutSession(
  payload: ICreateCheckoutPayload,
): Promise<TApiResponse<ICreateCheckoutResponse>> {
  return await apiPost<ICreateCheckoutResponse>("/api/payments/create", payload);
}


//  * Fetches all payments for the authenticated user (Tenant sees own, Admin sees all) via GET /api/payments

export async function getPayments(): Promise<TApiResponse<TPayment[]>> {
  return await apiGet<TPayment[]>("/api/payments", {
    next: { revalidate: 0 },
  });
}


//  * Fetches a single payment detail by ID via GET /api/payments/:id

export async function getPaymentById(
  paymentId: string,
): Promise<TApiResponse<TPayment>> {
  return await apiGet<TPayment>(`/api/payments/${paymentId}`, {
    next: { revalidate: 0 },
  });
}

export const paymentService = {
  createCheckoutSession,
  getPayments,
  getPaymentById,
};