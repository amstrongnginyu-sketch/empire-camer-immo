export type Message = {
  id: string;
  annonceId: string;
  annonceTitle: string;
  fromUserId: string;
  fromUserEmail: string;
  fromUserName: string;
  toUserId: string;
  toUserEmail: string;
  participants: string[];
  text: string;
  status: "sent" | "read";
  createdAt?: any;
};