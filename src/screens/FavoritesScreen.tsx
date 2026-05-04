import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PropertyCard } from "../components/PropertyCard";
import { useProperties } from "../hooks/useProperties";

const FAVORITES_KEY = "empire_camer_immo_favorites";

type Props = {
  onOpenProperty?: (property: any) => void;
};

const DEMO_PROPERTIES = [
  {
    id: "demo-1",
    title: "Villa moderne avec piscine",
    price: 250000000,
    city: "Douala",
    quartier: "Bonapriso",
    bedrooms: 4,
    bathrooms: 3,
    surface: 320,
    type: "Maison",
    purpose: "Vente",
    boost: true,
    images: [],
    agentName: "Empire Immo",
    sellerPhone: "237600000000",
  },
];

function getFavorites(): { id: string; date: number }[] {
  try {
    const raw = globalThis?.localStorage?.getItem(FAVORITES_KEY);
    const data = raw ? JSON.parse(raw) : [];

    return data.map((item: any) => {
      if (typeof item === "string") {
        return { id: item, date: 0 };
      }

      return {
        id: String(item.id),
        date: Number(item.date || 0),
      };
    });
  } catch {
    return [];
  }
}

export default function FavoritesScreen({ onOpenProperty }: Props) {
  const { recentProperties, popularProperties } = useProperties(true);
  const [favoriteIds, setFavoriteIds] = useState<{ id: string; date: number }[]>(
    []
  );

  useEffect(() => {
    setFavoriteIds(getFavorites());

    const timer = setInterval(() => {
      setFavoriteIds(getFavorites());
    }, 700);

    return () => clearInterval(timer);
  }, []);

  const allProperties = useMemo(() => {
    const map = new Map<string, any>();

    [...popularProperties, ...recentProperties].forEach((item: any) => {
      if (item?.id) map.set(String(item.id), item);
    });

    if (map.size === 0) {
      DEMO_PROPERTIES.forEach((item) => map.set(String(item.id), item));
    }

    return Array.from(map.values());
  }, [popularProperties, recentProperties]);

  const favorites = useMemo(() => {
    const dateMap = new Map(
      favoriteIds.map((item) => [String(item.id), item.date])
    );

    return allProperties
      .filter((property) => dateMap.has(String(property.id)))
      .sort((a, b) => {
        const dateA = dateMap.get(String(a.id)) || 0;
        const dateB = dateMap.get(String(b.id)) || 0;
        return dateB - dateA;
      });
  }, [allProperties, favoriteIds]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>❤️ Mes favoris</Text>

      <Text style={styles.subtitle}>
        Les biens ajoutés récemment apparaissent en premier.
      </Text>

      {favorites.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>Aucun favori pour le moment</Text>
          <Text style={styles.emptyText}>
            Clique sur le cœur d’une annonce pour l’ajouter ici.
          </Text>
        </View>
      ) : (
        <View style={styles.list}>
          {favorites.map((item) => (
            <PropertyCard
              key={item.id}
              item={item}
              onPress={() => onOpenProperty?.(item)}
            />
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8F6",
    padding: 18,
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#06251A",
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 22,
    color: "#51635A",
    fontWeight: "800",
  },

  list: {
    gap: 16,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 28,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginTop: 20,
  },

  emptyTitle: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
  },

  emptyText: {
    color: "#51635A",
    fontWeight: "700",
    marginTop: 8,
  },
});