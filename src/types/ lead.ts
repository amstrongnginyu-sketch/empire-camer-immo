export type LeadSource = "call" | "whatsapp" | "message" | "visit";

export type Lead = {
  id: string;
  annonceId: string;
  annonceTitle: string;
  ownerId: string;
  ownerEmail: string;
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  source: LeadSource;
  city: string;
  quartier: string;
  price: string;
  createdAt?: any;
};