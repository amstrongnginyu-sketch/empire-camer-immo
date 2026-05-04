export type UserRole = "user" | "admin" | "agency";

export type UserProfile = {
  uid: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  agencyUntil?: string | null;
  createdAt?: any;
  updatedAt?: any;
};