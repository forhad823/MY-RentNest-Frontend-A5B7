"use server";

// -------- Rental Request Server Actions --------
import { TRentalRequest } from "@/lib/types";
import { submitRentalRequest as submitRentalRequestService } from "@/service/rental";

export interface ISubmitRentalRequestPayload {
  propertyId: string;
  rentAmount: number;
}

export type TRentalActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string; 
};

/****
 * Server action to submit a rental application for a property
 ****/
export async function submitRentalRequestAction(
  payload: ISubmitRentalRequestPayload,
): Promise<TRentalActionResponse<TRentalRequest>> {
  try {
    const res = await submitRentalRequestService(payload);
    return {
      success: res.success,
      message: res.message || "Rental request submitted successfully",
      data: res.data,
    };
  } catch (error: unknown) {
    const errMessage =
      error instanceof Error
        ? error.message
        : "Failed to submit rental request. Please try again.";
    return {
      success: false,
      message: errMessage,
      error: errMessage,
    };
  }
}
