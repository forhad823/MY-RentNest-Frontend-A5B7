// -------- Property & Category Public Fetch Services --------
import { apiGet } from "@/lib/api-client";
import { TApiResponse, TCategory, TProperty } from "@/lib/types";

export interface TPropertyQueryFilters {
  searchTerm?: string;
  location?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedroomCount?: number;
  bathroomCount?: number;
  amenities?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

/****
 * Fetches list of categories from public endpoint GET /api/categories
 ****/
export async function getCategories(): Promise<TApiResponse<TCategory[]>> {
  try {
    return await apiGet<TCategory[]>("/api/categories", {
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message: "Failed to fetch categories",
      data: [],
    };
  }
}

/****
 * Fetches catalog of rental properties with optional filtering parameters
 ****/
export async function getProperties(
  filters: TPropertyQueryFilters = {},
): Promise<TApiResponse<TProperty[]>> {
  try {
    const params = new URLSearchParams();

    if (filters.searchTerm) params.set("searchTerm", filters.searchTerm);
    if (filters.location) params.set("location", filters.location);
    if (filters.categoryId) params.set("categoryId", filters.categoryId);
    if (filters.minPrice !== undefined)
      params.set("minPrice", filters.minPrice.toString());
    if (filters.maxPrice !== undefined)
      params.set("maxPrice", filters.maxPrice.toString());
    if (filters.bedroomCount !== undefined)
      params.set("bedroomCount", filters.bedroomCount.toString());
    if (filters.bathroomCount !== undefined)
      params.set("bathroomCount", filters.bathroomCount.toString());
    if (filters.page !== undefined) params.set("page", filters.page.toString());
    if (filters.limit !== undefined)
      params.set("limit", filters.limit.toString());
    if (filters.sortBy) params.set("sortBy", filters.sortBy);
    if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);

    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach((amenity) =>
        params.append("amenities", amenity),
      );
    }

    const queryString = params.toString();
    const endpoint = `/api/properties${queryString ? `?${queryString}` : ""}`;

    return await apiGet<TProperty[]>(endpoint, {
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error("Error fetching properties:", error);
    return {
      success: false,
      message: "Failed to fetch properties",
      data: [],
    };
  }
}

/****
 * Fetches single property details by ID via GET /api/properties/:id
 ****/
export async function getPropertyById(
  id: string,
): Promise<TApiResponse<TProperty | null>> {
  try {
    return await apiGet<TProperty>(`/api/properties/${id}`, {
      next: { revalidate: 0 },
    });
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error);
    return {
      success: false,
      message: "Property not found",
      data: null,
    };
  }
}

export const propertyService = {
  getCategories,
  getProperties,
  getPropertyById,
};
