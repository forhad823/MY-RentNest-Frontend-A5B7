// -------- Review Services --------
import { apiPost } from "@/lib/api-client";
import { TApiResponse, TReview } from "@/lib/types";

export interface ISubmitReviewPayload {
  propertyId: string;
  rating: number;
  comment: string;
}

export async function submitReview(
  payload: ISubmitReviewPayload,
): Promise<TApiResponse<TReview>> {
  return await apiPost<TReview>("/api/reviews", payload);
}

export const reviewService = {
  submitReview,
};
