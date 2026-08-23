// -------- Enums --------
export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BLOCKED";
export type PropertyAvailability = "AVAILABLE" | "RENTED" | "MAINTENANCE";
export type RentalRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

// -------- -------------------
export type TMeta = {
  page: number;
  limit: number;
  total: number;
};

export type TApiResponse<T> = {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: TMeta;
};

// -------- Server Action Response Envelope --------
// Standard shape every "use server" action returns to client components,
// so UI code can always rely on success/message/data/error fields.
export type TActionResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

// -----------------------
export type TUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: ActiveStatus;
  createdAt: string;
  updatedAt: string;
};

export type TCategory = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TProperty = {
  id: string;
  title: string;
  location: string;
  price: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  images?: string[];
  availabilityStatus: PropertyAvailability;
  categoryId: string;
  category?: TCategory;
  landlordId: string;
  landlord?: Partial<TUser>;
  reviews?: TReview[];
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
};

export type TRentalRequest = {
  id: string;
  tenantId: string;
  tenant?: Partial<TUser>;
  propertyId: string;
  property?: TProperty;
  rentAmount: number;
  status: RentalRequestStatus;
  createdAt: string;
  updatedAt: string;
};

export type TPayment = {
  id: string;
  rentalRequestId: string;
  rentalRequest?: TRentalRequest;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  stripeReceiptUrl?: string | null;
  paymentMethod?: string | null;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TReview = {
  id: string;
  rating: number;
  comment: string;
  propertyId: string;
  tenantId: string;
  tenant?: Partial<TUser>;
  createdAt: string;
  updatedAt: string;
};
