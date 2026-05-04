export type PropertyPurpose = "Vente" | "Location";
export type PropertyStatus = "pending" | "approved" | "rejected";

export type Property = {
  id: string;
  purpose: PropertyPurpose;

  title: string;
  type: string;

  city: string;
  quartier: string;
  reference?: string;

  agentName?: string;
  company?: string;

  price: string;
  description: string;

  sellerName: string;
  sellerPhone: string;

  bedrooms?: string;
  bathrooms?: string;
  surface?: string;
  landSurface?: string;

  mapAddress?: string;
  images: string[];

  status: PropertyStatus;
  verified: boolean;
  boost: boolean;
  boostUntil?: string | null;

  ownerId: string;
  ownerEmail: string;

  createdAt?: any;
  updatedAt?: any;
};