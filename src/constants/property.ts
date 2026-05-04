import { Property } from "../types/property";

export const PROPERTY_TYPES = [
  "Maison",
  "Appartement",
  "Terrain",
  "Immeuble",
  "Bureau",
  "Boutique",
];

export const PROPERTY_PURPOSES = ["Vente", "Location"];

export const DEMO_PROPERTIES: Property[] = [
  {
    id: "demo_1",
    title: "Villa moderne avec piscine",
    city: "Douala",
    quartier: "Bonapriso",
    type: "Maison",
    purpose: "Vente",
    price: "250000000",
    bedrooms: "4",
    bathrooms: "3",
    surface: "320",
    landSurface: "500",
    description: "Villa premium dans quartier résidentiel calme.",
    sellerName: "Empire Immo",
    sellerPhone: "237600000000",
    images: [],
    verified: true,
    boost: true,
    status: "approved",
    ownerId: "demo",
    ownerEmail: "",
  },
];