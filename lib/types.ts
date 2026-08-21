// -------- RentNest Shared Types & Interfaces ---------

export type Role = "TENANT" | "LANDLORD" | "ADMIN";
export type ActiveStatus = "ACTIVE" | "BLOCKED";
export type PropertyAvailability = "AVAILABLE" | "RENTED" | "MAINTENANCE";
export type RentalRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  activeStatus: ActiveStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICategory {
  id?: string;
  name: string;
  description?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IReview {
  id: string;
  propertyId: string;
  tenantId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  bedroomCount: number;
  bathroomCount: number;
  amenities: string[];
  availabilityStatus: PropertyAvailability;
  categoryId: string;
  landlordId: string;
  createdAt: string;
  updatedAt: string;
  category?: ICategory;
  landlord?: {
    id: string;
    name: string;
    email: string;
    role: Role;
  };
  reviews?: IReview[];
  averageRating?: number;
  totalReviews?: number;
  _count?: {
    reviews: number;
  };
}

export interface IRentalRequest {
  id: string;
  tenantId: string;
  propertyId: string;
  rentAmount: number;
  status: RentalRequestStatus;
  createdAt: string;
  updatedAt: string;
  property?: {
    id: string;
    title: string;
    location: string;
    price: number;
    availabilityStatus?: PropertyAvailability;
    category?: {
      name: string;
    };
    landlord?: {
      id: string;
      name: string;
      email: string;
    };
  };
  tenant?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IPayment {
  id: string;
  rentalRequestId: string;
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
  rentalRequest?: {
    id: string;
    status: RentalRequestStatus;
    property?: {
      id: string;
      title: string;
      location: string;
    };
    tenant?: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface IApiResponse<T> {
  success: boolean;
  statusCode?: number;
  message?: string;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface GetMeResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    currentUser: IUser;
  };
}

export interface NavbarProps {
  user?: GetMeResponse | null;
}
