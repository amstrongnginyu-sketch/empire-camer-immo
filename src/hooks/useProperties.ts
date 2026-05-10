import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";

import { db } from "../../firebaseConfig";
import { DEMO_PROPERTIES } from "../constants/property";
import { Property } from "../types/property";
import { numberOnly } from "../utils/format";

export type PropertyFilters = {
  searchText: string;
  purpose: string;
  city: string;
  quartier: string;
  type: string;
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  favoritesOnly: boolean;
};

const defaultFilters: PropertyFilters = {
  searchText: "",
  purpose: "",
  city: "",
  quartier: "",
  type: "",
  minPrice: "",
  maxPrice: "",
  minBedrooms: "",
  favoritesOnly: false,
};

function cleanImages(data: any): string[] {
  const imageUrls = Array.isArray(data.imageUrls) ? data.imageUrls : [];
  const images = Array.isArray(data.images) ? data.images : [];

  return [...imageUrls, ...images]
    .filter((url) => typeof url === "string")
    .map((url) => url.trim())
    .filter((url) => url.length > 8)
    .filter((url) => url.startsWith("http://") || url.startsWith("https://"))
    .filter((url) => url !== "[]" && url !== "null" && url !== "undefined");
}

function normalizeAnnonce(id: string, data: any): Property {
  return {
    id,

    title: data.title || "Annonce immobilière",
    price: Number(data.price || 0),

    city: data.city || "",
    quartier: data.quartier || "",
    type: data.type || "Bien",
    purpose: data.purpose || data.listingType || "Vente",

    bedrooms: Number(data.bedrooms || 0),
    bathrooms: Number(data.bathrooms || 0),
    surface: Number(data.surface || data.area || 0),
    landSurface: Number(data.landSurface || data.landSize || 0),

    description: data.description || "",
    images: cleanImages(data),

    boost: Boolean(data.boost || data.premium || data.sponsored),
    verified: Boolean(data.verified),

    sellerName: data.sellerName || data.agentName || "Empire Immo",
    sellerPhone: data.sellerPhone || data.whatsapp || "+971522597552",
    agentName: data.agentName || data.sellerName || "Empire Immo",

    ownerId: data.ownerId || data.userId || "",
    ownerEmail: data.ownerEmail || "",
    createdAt: data.createdAt || null,

    ...data,
    images: cleanImages(data),
  } as Property;
}

export function useProperties(isLoggedIn: boolean, favorites: string[] = []) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);

  useEffect(() => {
    const q = query(collection(db, "annonces"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) =>
          normalizeAnnonce(doc.id, doc.data())
        );

        setProperties(items);
      },
      (error) => {
        console.log("Erreur chargement annonces:", error);
        setProperties([]);
      }
    );

    return unsubscribe;
  }, []);

  const displayProperties = properties.length > 0 ? properties : DEMO_PROPERTIES;

  const filteredProperties = useMemo(() => {
    return displayProperties.filter((item) => {
      const text = `${item.title || ""} ${item.city || ""} ${item.quartier || ""} ${item.type || ""}`.toLowerCase();

      const itemPrice = numberOnly(item.price);
      const minPrice = numberOnly(filters.minPrice);
      const maxPrice = numberOnly(filters.maxPrice);
      const itemBedrooms = numberOnly(item.bedrooms);
      const minBedrooms = numberOnly(filters.minBedrooms);

      if (filters.searchText && !text.includes(filters.searchText.toLowerCase())) return false;
      if (filters.favoritesOnly && !favorites.includes(item.id)) return false;
      if (filters.purpose && item.purpose !== filters.purpose) return false;
      if (filters.city && !String(item.city || "").toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.quartier && !String(item.quartier || "").toLowerCase().includes(filters.quartier.toLowerCase())) return false;
      if (filters.type && item.type !== filters.type) return false;
      if (minPrice && itemPrice < minPrice) return false;
      if (maxPrice && itemPrice > maxPrice) return false;
      if (minBedrooms && itemBedrooms < minBedrooms) return false;

      return true;
    });
  }, [displayProperties, filters, favorites]);

  const popularProperties = useMemo(
    () => displayProperties.filter((item) => item.boost).slice(0, 8),
    [displayProperties]
  );

  const recentProperties = useMemo(
    () => displayProperties.slice(0, 12),
    [displayProperties]
  );

  return {
    properties: displayProperties,
    filteredProperties,
    popularProperties,
    recentProperties,
    filters,
    setFilters,
  };
}