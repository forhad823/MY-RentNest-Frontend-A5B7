"use server";

// -------- Rental Request Server Actions --------
import { TActionResponse, TRentalRequest } from "@/lib/types";
import {
  submitRentalRequest,
  ISubmitRentalRequestPayload,
} from "@/service/rental";

/****
 * Server action to submit a rental application for a property
 ****/
export async function submitRentalRequestAction(
  payload: ISubmitRentalRequestPayload,
): Promise<TActionResponse<TRentalRequest>> {
  try {
    const res = await submitRentalRequest(payload);
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
