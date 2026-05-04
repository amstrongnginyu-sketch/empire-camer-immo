export type PaymentType = "boost" | "agency_subscription";
export type PaymentStatus = "pending" | "approved" | "rejected";

export type Payment = {
  id: string;
  type: PaymentType;
  packId: string;
  packLabel: string;
  days: number;
  amount: number;
  method: "MTN MoMo" | "Orange Money";
  paymentPhone: string;
  reference: string;
  status: PaymentStatus;
  userId: string;
  userEmail: string;
  annonceId?: string;
  annonceTitle?: string;
  createdAt?: any;
  updatedAt?: any;
  approvedAt?: any;
};