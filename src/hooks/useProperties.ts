import { useEffect, useMemo, useState } from "react";

import { DEMO_PROPERTIES } from "../constants/property";
import { listenApprovedProperties } from "../services/propertyService";
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

export function useProperties(isLoggedIn: boolean, favorites: string[] = []) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);

  useEffect(() => {
    if (!isLoggedIn) {
      setProperties([]);
      return;
    }

    return listenApprovedProperties(setProperties);
  }, [isLoggedIn]);

  const displayProperties = properties.length > 0 ? properties : DEMO_PROPERTIES;

  const filteredProperties = useMemo(() => {
    return displayProperties.filter((item) => {
      const text = `${item.title} ${item.city} ${item.quartier} ${item.type}`.toLowerCase();

      const itemPrice = numberOnly(item.price);
      const minPrice = numberOnly(filters.minPrice);
      const maxPrice = numberOnly(filters.maxPrice);
      const itemBedrooms = numberOnly(item.bedrooms);
      const minBedrooms = numberOnly(filters.minBedrooms);

      if (filters.searchText && !text.includes(filters.searchText.toLowerCase())) return false;
      if (filters.favoritesOnly && !favorites.includes(item.id)) return false;
      if (filters.purpose && item.purpose !== filters.purpose) return false;
      if (filters.city && !item.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters.quartier && !item.quartier.toLowerCase().includes(filters.quartier.toLowerCase())) return false;
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